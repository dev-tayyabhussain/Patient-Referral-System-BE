const User = require('../models/User');
const Hospital = require('../models/Hospital');
const { sendEmail, emailTemplates } = require('../config/email');

// Get all pending users (for super admin)
const getPendingUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 10 } = req.query;

        const filter = { approvalStatus: 'pending' };
        if (role) {
            filter.role = role;
        }

        const users = await User.find(filter)
            .populate('hospitalId', 'name address')
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get pending users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending users',
            error: error.message
        });
    }
};

// Get all pending hospitals (for super admin)
const getPendingHospitals = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const hospitals = await Hospital.find({ status: 'pending' })
            .populate('adminId', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Hospital.countDocuments({ status: 'pending' });

        res.json({
            success: true,
            data: {
                hospitals,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get pending hospitals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending hospitals',
            error: error.message
        });
    }
};

// Get pending doctors for hospital admin
const getPendingDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const hospitalId = req.user.hospitalId;

        const doctors = await User.find({
            role: 'doctor',
            hospitalId: hospitalId,
            approvalStatus: 'pending'
        })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments({
            role: 'doctor',
            hospitalId: hospitalId,
            approvalStatus: 'pending'
        });

        res.json({
            success: true,
            data: {
                doctors,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get pending doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending doctors',
            error: error.message
        });
    }
};

// Approve user
const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { message } = req.body;
        const approverId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.approvalStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'User is not pending approval'
            });
        }

        await user.approve(approverId);

        // Send approval email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Account Approved - MediNet',
                html: emailTemplates.accountApproved(user.firstName, message)
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.json({
            success: true,
            message: 'User approved successfully',
            data: user
        });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving user',
            error: error.message
        });
    }
};

// Reject user
const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const rejectorId = req.user._id;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.approvalStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'User is not pending approval'
            });
        }

        await user.reject(reason, rejectorId);

        // Send rejection email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Account Application Rejected - MediNet',
                html: emailTemplates.accountRejected(user.firstName, reason)
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.json({
            success: true,
            message: 'User rejected successfully',
            data: user
        });
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting user',
            error: error.message
        });
    }
};

// Approve hospital
const approveHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { message } = req.body;
        const approverId = req.user._id;

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        if (hospital.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Hospital is not pending approval'
            });
        }

        await hospital.approve(approverId);

        // Also approve the hospital admin
        const hospitalAdmin = await User.findOne({
            hospitalId: hospitalId,
            role: 'hospital_admin'
        });

        if (hospitalAdmin) {
            hospitalAdmin.approvalStatus = 'approved';
            hospitalAdmin.approvedBy = approverId;
            hospitalAdmin.approvedAt = new Date();
            await hospitalAdmin.save();
        }

        // Send approval email to hospital admin
        if (hospitalAdmin) {
            try {
                await sendEmail({
                    email: hospitalAdmin.email,
                    subject: 'Hospital Approved - MediNet',
                    html: emailTemplates.hospitalApproved(hospital.name, message)
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }

        res.json({
            success: true,
            message: 'Hospital approved successfully',
            data: hospital
        });
    } catch (error) {
        console.error('Approve hospital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving hospital',
            error: error.message
        });
    }
};

// Reject hospital
const rejectHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { reason } = req.body;
        const rejectorId = req.user._id;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        if (hospital.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Hospital is not pending approval'
            });
        }

        await hospital.reject(reason, rejectorId);

        // Send rejection email to hospital admin
        if (hospital.adminId) {
            try {
                const admin = await User.findById(hospital.adminId);
                if (admin) {
                    await sendEmail({
                        email: admin.email,
                        subject: 'Hospital Application Rejected - MediNet',
                        html: emailTemplates.hospitalRejected(hospital.name, reason)
                    });
                }
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }

        res.json({
            success: true,
            message: 'Hospital rejected successfully',
            data: hospital
        });
    } catch (error) {
        console.error('Reject hospital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting hospital',
            error: error.message
        });
    }
};

// Get approval statistics
const getApprovalStats = async (req, res) => {
    try {
        const stats = {
            pendingUsers: await User.countDocuments({ approvalStatus: 'pending' }),
            approvedUsers: await User.countDocuments({ approvalStatus: 'approved' }),
            rejectedUsers: await User.countDocuments({ approvalStatus: 'rejected' }),
            pendingHospitals: await Hospital.countDocuments({ status: 'pending' }),
            approvedHospitals: await Hospital.countDocuments({ status: 'approved' }),
            rejectedHospitals: await Hospital.countDocuments({ status: 'rejected' })
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get approval stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching approval statistics',
            error: error.message
        });
    }
};

module.exports = {
    getPendingUsers,
    getPendingHospitals,
    getPendingDoctors,
    approveUser,
    rejectUser,
    approveHospital,
    rejectHospital,
    getApprovalStats
};

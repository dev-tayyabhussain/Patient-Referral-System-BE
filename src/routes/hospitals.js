const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
    createHospital,
    getHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital,
    getApprovedHospitals
} = require('../controllers/hospitalController');

const { protect, authorize } = require('../middleware/auth');
const { validateHospital } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: Hospital management
 */

/**
 * @swagger
 * /api/hospitals:
 *   post:
 *     summary: Create a new hospital (Public - for registration)
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HospitalRegistration'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hospital registered successfully. Awaiting approval."
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateHospital, createHospital);

/**
 * @swagger
 * /api/hospitals/approved:
 *   get:
 *     summary: Get all approved hospitals (Public)
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: Approved hospitals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 *       500:
 *         description: Server error
 */
router.get('/approved', getApprovedHospitals);

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     summary: Get all hospitals (Super Admin only)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Hospitals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     hospitals:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Hospital'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         total:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin only
 */
router.get('/', protect, authorize('super_admin'), getHospitals);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     responses:
 *       200:
 *         description: Hospital retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital not found
 */
router.get('/:id', protect, getHospitalById);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   put:
 *     summary: Update hospital (Super Admin or Hospital Admin)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HospitalUpdate'
 *     responses:
 *       200:
 *         description: Hospital updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hospital updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Hospital not found
 */
router.put('/:id', protect, authorize('super_admin', 'hospital_admin'), validateHospital, updateHospital);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   delete:
 *     summary: Delete hospital (Super Admin only)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     responses:
 *       200:
 *         description: Hospital deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hospital deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin only
 *       404:
 *         description: Hospital not found
 */
router.delete('/:id', protect, authorize('super_admin'), deleteHospital);

module.exports = router;
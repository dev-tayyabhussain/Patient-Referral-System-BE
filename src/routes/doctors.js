const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented with controllers
router.get('/', (req, res) => {
    res.json({ message: 'Get all doctors endpoint - to be implemented' });
});

router.get('/:id', (req, res) => {
    res.json({ message: 'Get doctor by ID endpoint - to be implemented' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Create doctor endpoint - to be implemented' });
});

router.put('/:id', (req, res) => {
    res.json({ message: 'Update doctor endpoint - to be implemented' });
});

router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete doctor endpoint - to be implemented' });
});

router.get('/:id/patients', (req, res) => {
    res.json({ message: 'Get doctor patients endpoint - to be implemented' });
});

router.get('/:id/referrals', (req, res) => {
    res.json({ message: 'Get doctor referrals endpoint - to be implemented' });
});

module.exports = router;

const express = require('express');
const { generateQRCode, processCheckIn, getCheckInStats } = require('../controllers/checkinController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Generate QR code for event (Admin only)
router.get('/generate/:eventId', generateQRCode);

// Process check-in from QR scan
router.post('/process', protect, processCheckIn);

// Get check-in statistics (Admin only)
router.get('/stats/:eventId', protect, admin, getCheckInStats);

module.exports = router;
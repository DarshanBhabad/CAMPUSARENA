const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');

// Generate QR code for event check-in
const generateQRCode = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Simple QR data without database lookup for testing
    const checkInData = {
      eventId: eventId,
      timestamp: Date.now(),
      type: 'checkin'
    };
    
    const qrData = JSON.stringify(checkInData);
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    
    res.json({
      success: true,
      qrCode: qrCodeUrl,
      eventTitle: 'Test Event'
    });
  } catch (error) {
    console.error('QR Generation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Process check-in from QR scan
const processCheckIn = async (req, res) => {
  try {
    const { qrData, userId } = req.body;
    
    const checkInInfo = JSON.parse(qrData);
    const { eventId } = checkInInfo;
    
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    
    if (!event || !user) {
      return res.status(404).json({ message: 'Event or user not found' });
    }

    // Check if user is registered for this event
    const isRegistered = event.registeredUsers.some(reg => reg.user.toString() === userId);
    if (!isRegistered) {
      return res.status(400).json({ message: 'User not registered for this event' });
    }

    // Mark as checked in (add checkedIn field to registration)
    const registration = event.registeredUsers.find(reg => reg.user.toString() === userId);
    registration.checkedIn = true;
    registration.checkInTime = new Date();
    
    await event.save();
    
    res.json({
      success: true,
      message: 'Check-in successful',
      user: user.username,
      event: event.title
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get check-in statistics
const getCheckInStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('registeredUsers.user', 'username email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const checkedInUsers = event.registeredUsers.filter(reg => reg.checkedIn);
    const totalRegistered = event.registeredUsers.length;
    
    res.json({
      success: true,
      eventTitle: event.title,
      totalRegistered,
      checkedIn: checkedInUsers.length,
      checkInRate: totalRegistered > 0 ? (checkedInUsers.length / totalRegistered * 100).toFixed(1) : 0,
      checkedInUsers: checkedInUsers.map(reg => ({
        username: reg.user.username,
        email: reg.user.email,
        checkInTime: reg.checkInTime
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateQRCode,
  processCheckIn,
  getCheckInStats
};
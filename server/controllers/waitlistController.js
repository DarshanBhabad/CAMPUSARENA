const Waitlist = require('../models/Waitlist');
const Event = require('../models/Event');

const joinWaitlist = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already on waitlist
    const existingWaitlist = await Waitlist.findOne({ user: userId, event: eventId });
    if (existingWaitlist) {
      return res.status(400).json({ message: 'Already on waitlist' });
    }

    // Get next position
    const waitlistCount = await Waitlist.countDocuments({ event: eventId });
    
    const waitlistEntry = await Waitlist.create({
      user: userId,
      event: eventId,
      position: waitlistCount + 1
    });

    res.json({ 
      success: true, 
      message: 'Added to waitlist',
      position: waitlistEntry.position
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWaitlistPosition = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const waitlistEntry = await Waitlist.findOne({ user: userId, event: eventId });
    
    if (!waitlistEntry) {
      return res.json({ onWaitlist: false });
    }

    res.json({ 
      onWaitlist: true, 
      position: waitlistEntry.position 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventWaitlist = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const waitlist = await Waitlist.find({ event: eventId })
      .populate('user', 'username email')
      .sort({ position: 1 });

    res.json({ success: true, waitlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { joinWaitlist, getWaitlistPosition, getEventWaitlist };
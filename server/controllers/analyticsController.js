const Event = require('../models/Event');
const User = require('../models/User');
const Review = require('../models/Review');

const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Basic stats
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ date: { $gte: now } });
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Event.aggregate([
      { $unwind: '$registeredUsers' },
      { $match: { 'registeredUsers.paymentStatus': 'completed' } },
      { $group: { _id: null, total: { $sum: '$fees' } } }
    ]);

    // Monthly growth
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const newEventsThisMonth = await Event.countDocuments({ createdAt: { $gte: lastMonth } });

    // Popular categories
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } }
    ]);

    // Event performance
    const topEvents = await Event.aggregate([
      { $addFields: { registrationRate: { $divide: ['$registeredCount', '$capacity'] } } },
      { $sort: { registrationRate: -1 } },
      { $limit: 5 },
      { $project: { title: 1, registrationRate: 1, registeredCount: 1, capacity: 1 } }
    ]);

    // Revenue by month
    const revenueByMonth = await Event.aggregate([
      { $unwind: '$registeredUsers' },
      { $match: { 'registeredUsers.paymentStatus': 'completed' } },
      { $group: {
        _id: { 
          year: { $year: '$registeredUsers.registeredAt' },
          month: { $month: '$registeredUsers.registeredAt' }
        },
        revenue: { $sum: '$fees' },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalEvents,
          activeEvents,
          totalUsers,
          totalRevenue: totalRevenue[0]?.total || 0,
          newUsersThisMonth,
          newEventsThisMonth
        },
        categoryStats,
        topEvents,
        revenueByMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEventAnalytics = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId).populate('registeredUsers.user', 'username email');
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    // Registration timeline
    const registrationTimeline = event.registeredUsers.map(reg => ({
      date: reg.registeredAt,
      count: 1
    })).reduce((acc, curr) => {
      const date = curr.date.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + curr.count;
      return acc;
    }, {});

    // Demographics
    const demographics = await User.aggregate([
      { $match: { _id: { $in: event.registeredUsers.map(r => r.user) } } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      status: 'success',
      data: {
        event: {
          title: event.title,
          registeredCount: event.registeredCount,
          capacity: event.capacity,
          revenue: event.fees * event.registeredCount
        },
        registrationTimeline,
        demographics
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getEventAnalytics };
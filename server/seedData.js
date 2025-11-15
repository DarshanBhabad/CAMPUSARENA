const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Review = require('./models/Review');
const Comment = require('./models/Comment');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Review.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const users = await User.insertMany([
      {
        username: 'admin1',
        email: 'admin1@campusarena.com',
        password: await bcrypt.hash('Admin@123', 12),
        role: 'Admin'
      },
      {
        username: 'admin2', 
        email: 'admin2@campusarena.com',
        password: await bcrypt.hash('Admin@456', 12),
        role: 'Admin'
      },
      {
        username: 'john_doe',
        email: 'john@student.com',
        password: hashedPassword,
        role: 'Student'
      },
      {
        username: 'jane_smith',
        email: 'jane@student.com', 
        password: hashedPassword,
        role: 'Student'
      },
      {
        username: 'mike_wilson',
        email: 'mike@student.com',
        password: hashedPassword,
        role: 'Student'
      }
    ]);
    console.log('👥 Created users');

    // Create Events with registrations and payments
    const events = await Event.insertMany([
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring latest trends in AI and Web Development',
        date: new Date('2024-02-15T10:00:00Z'),
        location: 'Main Auditorium',
        category: 'Technical',
        capacity: 100,
        fees: 500,
        organizer: users[0]._id,
        registeredUsers: [
          {
            user: users[2]._id,
            registeredAt: new Date('2024-01-10T09:00:00Z'),
            paymentStatus: 'completed',
            paymentId: 'pay_tech_001',
            amountPaid: 500
          },
          {
            user: users[3]._id,
            registeredAt: new Date('2024-01-12T14:30:00Z'),
            paymentStatus: 'completed', 
            paymentId: 'pay_tech_002',
            amountPaid: 500
          }
        ]
      },
      {
        title: 'Cultural Fest',
        description: 'Celebrate diversity with music, dance, and food from around the world',
        date: new Date('2024-03-20T18:00:00Z'),
        location: 'Campus Ground',
        category: 'Cultural',
        capacity: 200,
        fees: 0,
        organizer: users[1]._id,
        registeredUsers: [
          {
            user: users[2]._id,
            registeredAt: new Date('2024-02-01T10:00:00Z'),
            paymentStatus: 'completed',
            amountPaid: 0
          },
          {
            user: users[3]._id,
            registeredAt: new Date('2024-02-02T11:00:00Z'),
            paymentStatus: 'completed',
            amountPaid: 0
          },
          {
            user: users[4]._id,
            registeredAt: new Date('2024-02-03T12:00:00Z'),
            paymentStatus: 'completed',
            amountPaid: 0
          }
        ]
      },
      {
        title: 'Sports Championship',
        description: 'Inter-college sports competition with multiple events',
        date: new Date('2024-04-10T08:00:00Z'),
        location: 'Sports Complex',
        category: 'Sports',
        capacity: 150,
        fees: 200,
        organizer: users[0]._id,
        registeredUsers: [
          {
            user: users[4]._id,
            registeredAt: new Date('2024-03-01T15:00:00Z'),
            paymentStatus: 'pending',
            paymentId: 'pay_sports_001',
            amountPaid: 0
          }
        ]
      },
      {
        title: 'Academic Symposium',
        description: 'Research presentations and academic discussions',
        date: new Date('2024-05-05T09:00:00Z'),
        location: 'Conference Hall',
        category: 'Academic',
        capacity: 80,
        fees: 300,
        organizer: users[1]._id,
        registeredUsers: []
      },
      {
        title: 'Social Service Drive',
        description: 'Community service and social awareness campaign',
        date: new Date('2024-06-15T07:00:00Z'),
        location: 'Community Center',
        category: 'Social',
        capacity: 50,
        fees: 0,
        organizer: users[0]._id,
        registeredUsers: [
          {
            user: users[2]._id,
            registeredAt: new Date('2024-05-01T08:00:00Z'),
            paymentStatus: 'completed',
            amountPaid: 0
          }
        ]
      }
    ]);
    console.log('🎉 Created events with registrations');

    // Create Reviews
    await Review.insertMany([
      {
        user: users[2]._id,
        event: events[0]._id,
        rating: 5,
        comment: 'Excellent conference! Learned a lot about AI trends.',
        isVerified: true,
        helpful: [users[3]._id, users[4]._id],
        createdAt: new Date('2024-02-16T10:00:00Z')
      },
      {
        user: users[3]._id,
        event: events[0]._id,
        rating: 4,
        comment: 'Great speakers and networking opportunities.',
        isVerified: true,
        helpful: [users[2]._id],
        createdAt: new Date('2024-02-16T11:00:00Z')
      },
      {
        user: users[2]._id,
        event: events[1]._id,
        rating: 5,
        comment: 'Amazing cultural performances and food!',
        isVerified: true,
        helpful: [users[3]._id, users[4]._id],
        createdAt: new Date('2024-03-21T10:00:00Z')
      }
    ]);
    console.log('⭐ Created reviews');

    // Create Comments
    await Comment.insertMany([
      {
        event: events[0]._id,
        user: users[2]._id,
        text: 'Looking forward to this tech conference! Anyone else excited about the AI sessions?',
        likes: [users[3]._id, users[4]._id],
        replies: [
          {
            user: users[3]._id,
            text: 'Yes! The machine learning workshop looks amazing.',
            createdAt: new Date('2024-01-11T10:00:00Z')
          }
        ]
      },
      {
        event: events[1]._id,
        user: users[4]._id,
        text: 'Cultural fest is always the highlight of the year! 🎉',
        likes: [users[2]._id, users[3]._id]
      },
      {
        event: events[2]._id,
        user: users[3]._id,
        text: 'Who\'s participating in the basketball tournament?',
        likes: [users[4]._id]
      }
    ]);
    console.log('💬 Created comments');

    console.log('🎊 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🎉 Events: ${events.length}`);
    console.log(`⭐ Reviews: 3`);
    console.log(`💰 Total Revenue: ₹${events.reduce((sum, e) => sum + (e.fees * e.registeredUsers.filter(r => r.paymentStatus === 'completed').length), 0)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
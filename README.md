---

## 🚀 Live Demo

This project is live! Check it out:

//**[https://campusarena.onrender.com](https://campusarena.onrender.com)**

---

## 🛠️ Tech Stack
# CampusArena v2.0 - Industry-Ready Campus Event Management Platform

A professional MERN stack application for managing campus events with role-based authentication, real-time notifications, and comprehensive admin controls.

## 🚀 Features

### For Students
- Browse and search campus events by category
- Register/cancel event registrations
- View personal registration history
- Email confirmations for registrations

### For Admins
- Complete event management (CRUD operations)
- User management and role assignment
- Dashboard with analytics and statistics
- Event registration tracking

## 🏗️ Architecture

```
campusarena/
├── server/                     # Backend (Express + MongoDB)
│   ├── config/db.js           # Database connection
│   ├── controllers/           # Business logic
│   ├── middlewares/           # Auth & error handling
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── utils/                # Email & file upload
│   └── tests/                # Jest + Supertest tests
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route components
│   │   └── context/          # State management
└── docs/                     # API documentation
```

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Nodemailer for email notifications
- Multer for file uploads
- Helmet & CORS for security
- Jest & Supertest for testing

**Frontend:**
- React 18 with Hooks
- Axios for API calls
- Context API for state management
- Tailwind CSS for styling
- Responsive design

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd campusarena
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

3. **Setup Frontend**
```bash
cd ../client
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Environment Configuration

Create `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/campusarena
MONGODB_TEST_URI=mongodb://localhost:27017/campusarena_test

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=development

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 👤 Default Admin Accounts

Two admin accounts are created automatically:

| Username | Password | Role |
|----------|----------|------|
| admin1 | Admin@123 | Admin |
| admin2 | Admin@456 | Admin |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Events
- `GET /api/events` - Get all events (with pagination & filters)
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration
- `GET /api/events/my-registrations` - Get user's registrations

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get dashboard statistics

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### API Testing with Postman
Import the provided Postman collection: `CampusArena-API.postman_collection.json`

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Manual Docker Build
```bash
# Backend
docker build -t campusarena-server ./server

# Frontend
docker build -t campusarena-client ./client
```

## 🔒 Security Features

- JWT-based authentication with 30-day expiration
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## 📊 Database Schema

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  role: String (enum: ['Student', 'Admin'])
  profileImage: String
  isActive: Boolean
  timestamps: true
}
```

### Event Model
```javascript
{
  title: String (required)
  description: String (required)
  date: Date (required)
  location: String (required)
  category: String (enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Social'])
  capacity: Number (required)
  registeredUsers: [{ user: ObjectId, registeredAt: Date }]
  organizer: ObjectId (ref: User)
  poster: String
  isActive: Boolean
  timestamps: true
}
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusarena
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com
```

### AWS Deployment
1. Use Elastic Beanstalk for backend
2. Use S3 + CloudFront for frontend
3. Use MongoDB Atlas for database
4. Configure environment variables in AWS console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@campusarena.com or create an issue in the repository.

---

**Built with ❤️ for campus communities**

# MediNet Backend API

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

A comprehensive healthcare management API built with Node.js, Express.js, and MongoDB for the MediNet platform.

## 🚀 Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/medinet-backend)

## 🏗️ Architecture

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT with role-based access control
- **File Storage**: Cloudinary
- **Email**: NodeMailer
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, Rate Limiting

## 🔧 Environment Variables

| Variable                | Description               | Required | Default               |
| ----------------------- | ------------------------- | -------- | --------------------- |
| `PORT`                  | Server port               | No       | `5000`                |
| `NODE_ENV`              | Environment               | No       | `development`         |
| `MONGO_URI`             | MongoDB connection string | Yes      | -                     |
| `JWT_SECRET`            | JWT secret key            | Yes      | -                     |
| `JWT_EXPIRE`            | JWT expiration            | No       | `7d`                  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | Yes      | -                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | Yes      | -                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | Yes      | -                     |
| `EMAIL_USER`            | Email username            | Yes      | -                     |
| `EMAIL_PASS`            | Email password            | Yes      | -                     |
| `EMAIL_FROM`            | From email address        | No       | `noreply@medinet.com` |
| `CORS_ORIGIN`           | CORS allowed origin       | No       | `*`                   |

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/medinet-backend.git
   cd medinet-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://medinet-backend.onrender.com`

### Authentication Endpoints

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | Register new user      |
| POST   | `/api/auth/login`           | User login             |
| POST   | `/api/auth/logout`          | User logout            |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password         |
| GET    | `/api/auth/me`              | Get current user       |

### Hospital Endpoints

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/hospitals`            | List all hospitals     |
| GET    | `/api/hospitals/:id`        | Get hospital by ID     |
| POST   | `/api/hospitals`            | Create new hospital    |
| PUT    | `/api/hospitals/:id`        | Update hospital        |
| DELETE | `/api/hospitals/:id`        | Delete hospital        |
| PATCH  | `/api/hospitals/:id/status` | Update hospital status |

### Referral Endpoints

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/referrals`            | List referrals         |
| GET    | `/api/referrals/:id`        | Get referral by ID     |
| POST   | `/api/referrals`            | Create new referral    |
| PUT    | `/api/referrals/:id`        | Update referral        |
| PATCH  | `/api/referrals/:id/status` | Update referral status |
| POST   | `/api/referrals/:id/accept` | Accept referral        |
| POST   | `/api/referrals/:id/reject` | Reject referral        |

## 🗄️ Database Models

### User Model

- **Fields**: firstName, lastName, email, password, role, phone, dateOfBirth, gender, address, profileImage, hospitalId, licenseNumber, specialization
- **Roles**: super_admin, hospital_admin, doctor, patient
- **Indexes**: email, role, hospitalId

### Hospital Model

- **Fields**: name, code, type, level, address, contact, facilities, specialties, capacity, operatingHours, status, licenseNumber
- **Types**: public, private, clinic, specialty_center
- **Levels**: primary, secondary, tertiary, quaternary

### Patient Model

- **Fields**: firstName, lastName, dateOfBirth, gender, phone, email, nationalId, patientId, address, emergencyContact, bloodType, allergies, chronicConditions, medications, insurance, medicalHistory
- **Indexes**: patientId, nationalId, phone, email, currentHospital

### Referral Model

- **Fields**: referralId, patient, referringDoctor, referringHospital, receivingDoctor, receivingHospital, reason, priority, specialty, chiefComplaint, diagnosis, status, timeline, messages
- **Statuses**: pending, accepted, rejected, completed, cancelled
- **Priorities**: low, medium, high, urgent

## 🔐 Security Features

- **JWT Authentication** with role-based access control
- **Password hashing** using bcrypt with salt rounds
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS** configuration
- **Helmet** for security headers
- **File upload security** with type and size restrictions

## 🚀 Deployment

### Render Deployment

1. **Connect to Render**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Environment**

   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18`

3. **Set Environment Variables**

   - Add all required environment variables in Render dashboard
   - Set `NODE_ENV=production`
   - Set `CORS_ORIGIN` to your frontend URL

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your application

### Environment Variables for Production

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medinet
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=noreply@medinet.com
CORS_ORIGIN=https://medinet-frontend.vercel.app
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

- **Health Check**: `GET /api/health`
- **Logging**: Morgan for HTTP request logging
- **Error Tracking**: Centralized error handling
- **Database Monitoring**: MongoDB connection status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [MediNet Frontend](https://github.com/your-username/medinet-frontend) - React frontend application
- [MediNet Documentation](https://docs.medinet.com) - Complete documentation

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better healthcare**

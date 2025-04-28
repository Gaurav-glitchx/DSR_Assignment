
# DSR Management System

A NestJS-based Daily Status Report (DSR) Management System with user authentication and DSR tracking.

## Screenshots

### Swagger API Documentation
![Swagger UI]![Screenshot from 2025-04-28 11-02-16](https://github.com/user-attachments/assets/f0b71d21-6e57-41c6-8fe2-7093756fc992)

*Interactive API documentation with endpoint testing capabilities*

### SonarQube Code Analysis
![SonarQube Report]![Screenshot from 2025-04-25 14-02-53](https://github.com/user-attachments/assets/991a0de2-de2b-4c1a-a826-a00db111bab3)

*Code quality metrics and security vulnerability assessment*

## Features

- User authentication with JWT
- Password reset with OTP via email
- Profile management with photo upload
- Daily Status Report (DSR) management
- 8-hour daily work limit validation
- API documentation with Swagger

## Tech Stack

- Node.js + NestJS
- PostgreSQL with Sequelize
- Redis for OTP storage
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for sending OTP
- Cloudinary for profile photo storage
- Winston/Morgan for logging
- Swagger for API documentation

## Prerequisites

| Requirement    | Version   | Installation Guide                      |
|---------------|-----------|-----------------------------------------|
| Node.js       | ≥ 14.x    | [Download Node.js](https://nodejs.org/) |
| PostgreSQL    | ≥ 12.x    | [PostgreSQL Docs](https://www.postgresql.org/docs/) |
| Redis         | ≥ 6.x     | [Redis Quickstart](https://redis.io/docs/getting-started/) |
| npm           | ≥ 6.x     | Bundled with Node.js                    |

## Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd dsr-management
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env file in the root directory with the following variables:
\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=dsr_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

4. Start the development server:
\`\`\`bash
npm run start:dev
\`\`\`

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
\`http://localhost:3000/api-docs\`

## API Endpoints

### User Management
- POST /users/api/v1/signup – Create a new user account
- POST /users/api/v1/login – Authenticate user and return token
- POST /users/api/v1/forget-password – Trigger password reset process
- POST /users/api/v1/send-otp – Resend OTP for verification
- POST /users/api/v1/verify-otp – Verify OTP sent to user
- GET /users/api/v1/profile – Retrieve user profile details
- PATCH /users/api/v1/profile – Update user profile

### DSR Management
- POST /users/api/v1/dsr – Add new DSR
- PUT /users/api/v1/dsr/:id – Update DSR
- GET /users/api/v1/dsr – Fetch DSRs with pagination and date filtering
- GET /users/api/v1/dsr/:id – Get specific DSR details

## License

MIT

# Single Page Authentication

A full-stack authentication system with a React frontend and Express backend, providing secure user registration, login, and profile management.

## Features

- **Secure Authentication**: JWT-based authentication system
- **User Management**: Register, login, and profile management
- **Modern Frontend**: React 19 with React Router and TailwindCSS
- **Robust Backend**: Express.js with security best practices
- **Form Validation**: Client and server-side validation
- **API Security**: Rate limiting, CORS protection, and security headers
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 19
- React Router v6
- TailwindCSS
- React Query (TanStack Query)
- React Hook Form with Zod validation
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for request validation
- Helmet for security headers
- Express Rate Limit for API protection
- CORS for cross-origin resource sharing
- Morgan for request logging

## Project Structure

```
single-page-authentication/
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # TailwindCSS configuration
│
└── backend/                 # Express backend API
    ├── src/                 # Source code
    │   ├── controllers/     # Route controllers
    │   ├── middleware/      # Express middleware
    │   ├── routes/          # API routes
    │   └── server.js        # Server entry point
    └── package.json         # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/single-page-authentication.git
   cd single-page-authentication
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

2. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current user info (protected)

## Security Features

- JWT authentication with secure HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting to prevent brute force attacks
- CORS protection
- Security headers with Helmet
- Request size limiting
- Input validation and sanitization

## Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (when implemented)
cd backend
npm test
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing frontend library
- Express.js team for the robust backend framework
- TailwindCSS team for the utility-first CSS framework
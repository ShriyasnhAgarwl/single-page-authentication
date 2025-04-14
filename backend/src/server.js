require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const { errorMiddleware } = require('./middleware/error');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Request logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Security headers
app.use(helmet());

// CORS configuration
app.use((req, res, next) => {
  // Log CORS requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`CORS Request: ${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);
  }
  next();
});

// Configure CORS with more permissive settings for development
const corsOptions = {
  // In development, allow requests from any origin
  origin: process.env.NODE_ENV === 'development' 
    ? (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        // Allow all origins in development
        return callback(null, true);
      }
    : process.env.CLIENT_URL || 'http://localhost:3000',
  
  // Important for cookies and authentication
  credentials: true,
  
  // Allow all common methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Allow all headers needed for authentication
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  
  // Expose additional headers to the client
  exposedHeaders: ['Content-Length', 'X-Rate-Limit'],
  
  // Cache preflight request for 1 hour (3600 seconds)
  maxAge: 3600,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Rate limiting - general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again after 15 minutes'
});

// Request parsers with size limits
app.use(express.json({ limit: '10kb' })); // Parse JSON request body
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded request body

// Routes
app.use('/api/auth', authLimiter, authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Authentication API is running' });
});

// CORS test route - accessible without authentication
app.get('/api/test/cors', (req, res) => {
  // Log request details
  console.log('CORS Test Request:');
  console.log('  Origin:', req.headers.origin || 'No origin');
  console.log('  Headers:', JSON.stringify(req.headers, null, 2));
  
  // Set custom headers for debugging
  res.setHeader('X-CORS-Test', 'true');
  res.setHeader('X-Request-Origin', req.headers.origin || 'No origin');
  
  // Return test response with request details
  res.json({
    success: true,
    message: 'CORS test successful',
    cors: {
      origin: req.headers.origin || 'No origin',
      method: req.method,
      headers: {
        requestHeaders: {
          authorization: req.headers.authorization ? 'Present' : 'Not present',
          contentType: req.headers['content-type'] || 'Not present'
        },
        responseHeaders: res.getHeaders()
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Handle 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For testing purposes


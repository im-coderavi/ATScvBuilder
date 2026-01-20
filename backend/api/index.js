const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('../Config/db');

// Connect to database
connectDB();

const app = express();

// CORS configuration for production
const allowedOrigins = [
    'https://atscv-main.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app'))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('../Routes/user'));
app.use('/api/resumes', require('../Routes/resume'));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Health check
app.get('/api', (req, res) => {
    res.json({ status: 'ok', message: 'ResumeAI API is running' });
});

// Export for Vercel
module.exports = app;

const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Config/db');

connectDB();

const app = express();

// CORS configuration for production
const allowedOrigins = [
    'https://atscv-main.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

// Add FRONTEND_URL if set
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // In production, be more permissive for Vercel deployments
            if (origin.includes('vercel.app')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./Routes/user'));
app.use('/api/resumes', require('./Routes/resume'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Export for Vercel
module.exports = app;


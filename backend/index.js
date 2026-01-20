const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Config/db');

connectDB();

const app = express();

// CORS configuration for production
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
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


const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./Routes/user'));
app.use('/api/resumes', require('./Routes/resume'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

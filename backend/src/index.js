require('dotenv').config();
const { join } = require('path'); // Import join from path
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

const app = express();
app.use(express.json());

app.use('/uploads', express.static(join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/health', (req, res) => res.json({ ok:
    mongoose.connection.readyState === 1
}))

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
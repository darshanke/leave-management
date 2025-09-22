const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaves');
const userRoutes = require('./routes/users');


const app = express();
const allowedOrigins = [
  'https://factoessnew.vercel.app',
  'http://localhost:3000',
];
app.use(cors({
  origin: '*',
}));

app.use(express.json());
require("./jobs/autoForwardJob.js");
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;

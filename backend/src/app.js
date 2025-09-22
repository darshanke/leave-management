const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaves');
const userRoutes = require('./routes/users');


const app = express();
const allowedOrigins = ['http://localhost:3000', 'https://your-production-frontend-url.com'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like Postman or server-to-server requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
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

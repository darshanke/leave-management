require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const autoForwardJob = require('./jobs/autoForwardJob');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    autoForwardJob();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

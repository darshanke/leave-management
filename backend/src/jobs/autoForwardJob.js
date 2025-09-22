const cron = require("node-cron");
const LeaveRequest = require("../models/LeaveRequest");

const autoForwardJob = () => {
  // Runs every minute (adjust as needed)
  cron.schedule("* * * * *", async () => {
    console.log("Running Auto Forward Job...");

    try {
      // Find pending leave requests that haven't been forwarded yet
      const pendingLeaves = await LeaveRequest.find({ status: "pending" });

      const now = new Date();

      for (let leave of pendingLeaves) {
        const createdAt = new Date(leave.requestedAt);
        const diffInHours = (now - createdAt) / (1000 * 60 * 60);

        // Auto-forward if pending for more than 48 hours
        if (diffInHours >= 48) {
          leave.status = "forwarded";
          leave.forwardedToHRAt = now; // optional: track when it was forwarded
          await leave.save();

          console.log(`Auto-forwarded leave request: ${leave._id}`);
        }
      }
    } catch (err) {
      console.error("Error in autoForwardJob:", err.message);
    }
  });
};

module.exports = autoForwardJob;

const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "DevOpsSDM Backend",
    version: "1.1.0",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
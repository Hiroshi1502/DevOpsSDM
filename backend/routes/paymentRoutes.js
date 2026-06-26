const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayments,
} = require("../controllers/paymentController");

router.post("/pay", createPayment);
router.get("/", getPayments);

module.exports = router;
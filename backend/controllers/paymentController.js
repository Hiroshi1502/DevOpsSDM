const { processMockPayment } = require("../services/mockPaymentService");
const pool = require("../db/pool");

// Create payment transaction
exports.createPayment = async (req, res) => {
  try {
    const { fareAmount } = req.body;

    if (!fareAmount || fareAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid fare amount",
      });
    }

    const insertQuery = `
      INSERT INTO payment_transactions (fare_amount, status)
      VALUES ($1, 'PENDING')
      RETURNING *
    `;
    const newTx = await pool.query(insertQuery, [fareAmount]);
    const transaction = newTx.rows[0];

    const paymentResult = await processMockPayment(fareAmount);
    const finalStatus = paymentResult.success ? "SUCCESS" : "FAILED";

    const updateQuery = `
      UPDATE payment_transactions
      SET status = $1,
          transaction_ref = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const updatedTx = await pool.query(updateQuery, [
      finalStatus,
      paymentResult.transactionRef,
      transaction.id,
    ]);

    return res.json({
      success: true,
      data: updatedTx.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Payment processing error",
    });
  }
};

// Get all transactions (debug)
exports.getPayments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM payment_transactions ORDER BY created_at DESC"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get payments." });
  }
};
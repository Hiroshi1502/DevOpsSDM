// Mock Payment Gateway (Iteration 1)
function processMockPayment(amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = true; // force success for iteration 1
      resolve({
        success: isSuccess,
        transactionRef: `MOCK-${Date.now()}`,
        message: isSuccess ? "Payment successful" : "Payment failed",
      });
    }, 800);
  });
}

module.exports = { processMockPayment };
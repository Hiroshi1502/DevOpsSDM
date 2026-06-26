import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Payment({ fareData, onBack }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/payment/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fareAmount: fareData.totalFare ?? fareData.calculatedFare,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Payment failed");
      setResult(data.data);
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Payment Successful</h2>
        <p>Transaction ID: <strong>{result.transaction_ref}</strong></p>
        <p>Status: <strong>{result.status}</strong></p>
        <p>Amount Charged: <strong>RM {parseFloat(result.fare_amount).toFixed(2)}</strong></p>
        <button style={styles.button} onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment Module</h2>
      <p>Amount: <strong>RM {(fareData.totalFare ?? fareData.calculatedFare).toFixed(2)}</strong></p>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.actions}>
        <button style={styles.button} onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
        <button style={styles.secondaryButton} onClick={onBack} disabled={loading}>
          Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    background: "#ffffff",
    borderRadius: 18,
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
    maxWidth: 520,
    margin: "0 auto",
    textAlign: "center",
  },
  heading: {
    marginBottom: 18,
    fontSize: 24,
    color: "#0f172a",
  },
  error: {
    color: "#dc2626",
    marginBottom: 16,
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 22px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    minWidth: 130,
  },
  secondaryButton: {
    padding: "12px 22px",
    background: "#f1f5f9",
    color: "#1e293b",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    cursor: "pointer",
    minWidth: 130,
  },
};

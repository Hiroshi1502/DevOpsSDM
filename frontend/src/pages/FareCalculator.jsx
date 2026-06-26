import { useState } from "react";
import Payment from "./Payment";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VEHICLE_LABELS = {
  standard: { label: "Standard",  icon: "🚗", desc: "Everyday rides" },
  premium:  { label: "Premium",   icon: "🚙", desc: "Comfort & extra space" },
  van:      { label: "Van",       icon: "🚐", desc: "Groups & luggage" },
};

export default function FareCalculator() {
  const [vehicleType, setVehicleType]   = useState("standard");
  const [distanceKm, setDistanceKm]     = useState("");
  const [result, setResult]             = useState(null);
  const [goPayment, setGoPayment]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleCalculate = async () => {
    setError("");
    setResult(null);

    if (!distanceKm || parseFloat(distanceKm) <= 0) {
      setError("Please enter a valid distance greater than 0 km.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/fare/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleType,
          distanceKm: parseFloat(distanceKm),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setResult(data.data);
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVehicleType("standard");
    setDistanceKm("");
    setResult(null);
    setError("");
  };

  if (goPayment && result) {
    return (
      <Payment
        fareData={result}
        onBack={() => setGoPayment(false)}
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Fare Calculator</h1>
          <p style={styles.subtitle}>Estimate your trip cost instantly</p>
        </div>

        {/* Vehicle Type Selector */}
        <div style={styles.section}>
          <label style={styles.label}>Vehicle Type</label>
          <div style={styles.vehicleGrid}>
            {Object.entries(VEHICLE_LABELS).map(([type, meta]) => (
              <button
                key={type}
                onClick={() => setVehicleType(type)}
                style={{
                  ...styles.vehicleBtn,
                  ...(vehicleType === type ? styles.vehicleBtnActive : {}),
                }}
              >
                <span style={styles.vehicleIcon}>{meta.icon}</span>
                <span style={styles.vehicleName}>{meta.label}</span>
                <span style={styles.vehicleDesc}>{meta.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Distance Input */}
        <div style={styles.section}>
          <label style={styles.label} htmlFor="distance">
            Distance (km)
          </label>
          <div style={styles.inputWrapper}>
            <input
              id="distance"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="e.g. 12.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              style={styles.input}
            />
            <span style={styles.inputUnit}>km</span>
          </div>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Actions */}
        <div style={styles.actions}>
          <button
            onClick={handleCalculate}
            disabled={loading}
            style={{ ...styles.btnPrimary, ...(loading ? styles.btnDisabled : {}) }}
          >
            {loading ? "Calculating..." : "Calculate Fare"}
          </button>
          {result && (
            <button onClick={handleReset} style={styles.btnSecondary}>
              Reset
            </button>
          )}
        </div>

        {/* Result Breakdown */}
        {result && (
          <div style={styles.resultBox}>
            <h2 style={styles.resultTitle}>Fare Breakdown</h2>
            <div style={styles.resultRows}>
              <Row label="Vehicle Type"   value={VEHICLE_LABELS[result.vehicleType]?.label || result.vehicleType} />
              <Row label="Distance"       value={`${result.distanceKm} km`} />
              <Row label="Base Fare"      value={`RM ${result.baseFare.toFixed(2)}`} />
              <Row label="Rate"           value={`RM ${result.ratePerKm.toFixed(2)} / km`} />
              <Row label="Distance Charge" value={`RM ${result.distanceCharge.toFixed(2)}`} />
              <div style={styles.divider} />
              <Row
                label="Total Fare"
                value={`RM ${result.totalFare.toFixed(2)}`}
                highlight
              />
            </div>
            <p style={styles.resultNote}>
              💡 Peak hour surcharges coming in Iteration 2
            </p>
            <button
              onClick={() => setGoPayment(true)}
              style={styles.payButton}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={styles.row}>
      <span style={highlight ? styles.rowLabelBold : styles.rowLabel}>{label}</span>
      <span style={highlight ? styles.rowValueBold : styles.rowValue}>{value}</span>
    </div>
  );
}

// ─── Inline styles ───────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
  },
  header: { marginBottom: "28px" },
  title: { fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: 0 },
  subtitle: { fontSize: "14px", color: "#64748b", marginTop: "6px" },

  section: { marginBottom: "22px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "10px" },

  vehicleGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" },
  vehicleBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "14px 8px", border: "2px solid #e2e8f0", borderRadius: "12px",
    background: "#f8fafc", cursor: "pointer", transition: "all 0.15s ease",
  },
  vehicleBtnActive: {
    border: "2px solid #2563eb", background: "#eff6ff",
  },
  vehicleIcon: { fontSize: "22px", marginBottom: "4px" },
  vehicleName: { fontSize: "13px", fontWeight: 600, color: "#1e293b" },
  vehicleDesc: { fontSize: "10px", color: "#94a3b8", marginTop: "2px", textAlign: "center" },

  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  input: {
    width: "100%", padding: "12px 48px 12px 14px", fontSize: "15px",
    border: "2px solid #e2e8f0", borderRadius: "10px", outline: "none",
    color: "#0f172a", boxSizing: "border-box",
  },
  inputUnit: {
    position: "absolute", right: "14px", fontSize: "13px",
    color: "#94a3b8", fontWeight: 500,
  },

  errorBox: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
    borderRadius: "10px", padding: "12px 14px", fontSize: "13px", marginBottom: "16px",
  },

  actions: { display: "flex", gap: "12px", marginBottom: "20px" },
  btnPrimary: {
    flex: 1, padding: "13px", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "13px 20px", background: "#f1f5f9", color: "#475569",
    border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600,
    cursor: "pointer",
  },
  btnDisabled: { background: "#93c5fd", cursor: "not-allowed" },

  resultBox: {
    background: "#f0f9ff", border: "1px solid #bae6fd",
    borderRadius: "14px", padding: "20px",
  },
  resultTitle: { fontSize: "15px", fontWeight: 700, color: "#0369a1", margin: "0 0 14px 0" },
  resultRows: { display: "flex", flexDirection: "column", gap: "8px" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: "13px", color: "#64748b" },
  rowValue: { fontSize: "13px", color: "#1e293b", fontWeight: 500 },
  rowLabelBold: { fontSize: "15px", color: "#0f172a", fontWeight: 700 },
  rowValueBold: { fontSize: "18px", color: "#2563eb", fontWeight: 700 },
  divider: { height: "1px", background: "#bae6fd", margin: "4px 0" },
  resultNote: { fontSize: "11px", color: "#64748b", marginTop: "12px", marginBottom: 0 },
  payButton: {
    width: "100%",
    marginTop: "16px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    cursor: "pointer",
  },
};

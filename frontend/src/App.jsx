import { useState } from "react";
import FareCalculator from "./pages/FareCalculator";
import Payment from "./pages/Payment";

export default function App() {
  const [page, setPage] = useState("fare");
  const [fareData, setFareData] = useState(null);

  const handleProceedToPayment = (data) => {
    setFareData(data);
    setPage("payment");
  };

  const handleBack = () => {
    setPage("fare");
    setFareData(null);
  };

  if (page === "payment" && fareData) {
    return <Payment fareData={fareData} onBack={handleBack} />;
  }

  return <FareCalculator onProceedToPayment={handleProceedToPayment} />;
}

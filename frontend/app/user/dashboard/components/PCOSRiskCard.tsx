"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";

type RiskLevel = "Low" | "Moderate" | "High";

interface RiskResult {
  prediction: number;
  probability: number;
}

function getRiskLevel(probability: number): RiskLevel {
  if (probability < 0.35) return "Low";
  if (probability < 0.65) return "Moderate";
  return "High";
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; emoji: string; message: string }> = {
  Low: {
    color: "text-green-600",
    bg: "bg-green-50",
    emoji: "🟢",
    message: "Your indicators suggest a low risk of PCOS. Keep maintaining your healthy habits.",
  },
  Moderate: {
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    emoji: "🟡",
    message: "Some indicators suggest moderate risk. Consider consulting a gynecologist for a check-up.",
  },
  High: {
    color: "text-red-500",
    bg: "bg-red-50",
    emoji: "🔴",
    message: "Your indicators suggest a higher risk of PCOS. Please consult a doctor for proper diagnosis.",
  },
};

export default function PCOSRiskCard() {
  const { token } = useAuth();
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Step 1: Get onboarding data
    fetch("http://localhost:5000/onboarding", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(async (res) => {
        if (!res.data) { setLoading(false); return; }

        const d = res.data;

        // Map onboarding data to ML API input
        const mlInput = {
          age: d.age,
          weight: d.weight,
          height: d.height,
          bmi: d.bmi,
          cycle_length: d.cycleLength,
          follicle_count: 10, // default — not collected in onboarding
          acne: d.acneSeverity !== "None" ? 1 : 0,
          hair_growth: d.excessHair ? 1 : 0,
        };

        // Step 2: Call ML API
        const mlRes = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mlInput),
        });

        const mlData = await mlRes.json();
        setResult(mlData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </Card>
    );
  }

  if (error || !result) return null;

  const riskLevel = getRiskLevel(result.probability);
  const config = riskConfig[riskLevel];
  const percent = Math.round(result.probability * 100);

  return (
    <Card className={`p-6 ${config.bg} border border-opacity-20`}>
      <h2 className="text-lg font-medium text-[#3A3A4A] mb-4">PCOS Risk Assessment</h2>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{config.emoji}</span>
        <div>
          <p className={`text-2xl font-bold ${config.color}`}>{riskLevel} Risk</p>
          <p className="text-sm text-[#6B6B7A]">Probability: {percent}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${
            riskLevel === "Low" ? "bg-green-500" :
            riskLevel === "Moderate" ? "bg-yellow-400" : "bg-red-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm text-[#4A4A5A]">{config.message}</p>
      <p className="text-xs text-[#9A9AA8] mt-3">
        * This is an AI-based estimate, not a medical diagnosis.
      </p>
    </Card>
  );
}

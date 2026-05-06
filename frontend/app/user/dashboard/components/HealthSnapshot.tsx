"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

interface OnboardingData {
  bmi: number;
  cycleRegularity: string;
  activityLevel: string;
  stressLevel: number;
  age: number;
  weight: number;
  height: number;
  sleepHours: number;
  missedPeriods: number;
  cycleLength: number;
}

export default function HealthSnapshot() {
  const { token } = useAuth();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/onboarding", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const metrics = data
    ? [
        { label: "BMI", value: data.bmi.toFixed(1) },
        { label: "Cycle Regularity", value: data.cycleRegularity },
        { label: "Activity Level", value: data.activityLevel },
        { label: "Stress Level", value: `${data.stressLevel} / 5` },
        { label: "Sleep Hours", value: `${data.sleepHours}h` },
        { label: "Cycle Length", value: `${data.cycleLength} days` },
        { label: "Missed Periods", value: data.missedPeriods.toString() },
        { label: "Age", value: data.age.toString() },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 text-center animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
            <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto" />
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-4 text-center text-sm text-[#7A7A8A]">
        No health data found. Please complete onboarding.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((item) => (
        <Card key={item.label} className="p-4 text-center">
          <p className="text-xs text-[#7A7A8A]">{item.label}</p>
          <p className="text-lg font-medium text-[#3A3A4A] mt-1">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}

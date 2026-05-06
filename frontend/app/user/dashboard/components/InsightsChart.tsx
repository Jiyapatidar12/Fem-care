"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface OnboardingData {
  bmi: number;
  stressLevel: number;
  sleepHours: number;
  activityLevel: string;
  missedPeriods: number;
  cycleLength: number;
}

function normalize(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100);
}

export default function InsightsChart() {
  const { token } = useAuth();
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/onboarding", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => { if (res.data) setData(res.data); })
      .catch(() => {});
  }, [token]);

  if (!data) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-medium text-[#3A3A4A] mb-2">Health Insights Overview</h2>
        <div className="h-40 bg-[#FFF1F5] rounded flex items-center justify-center text-sm text-[#7A7A8A]">
          No data available
        </div>
      </Card>
    );
  }

  const activityScore = data.activityLevel === "High" ? 100 : data.activityLevel === "Moderate" ? 60 : 30;

  const chartData = [
    { subject: "BMI", value: normalize(data.bmi, 10, 40) },
    { subject: "Sleep", value: normalize(data.sleepHours, 3, 12) },
    { subject: "Activity", value: activityScore },
    { subject: "Stress", value: normalize(6 - data.stressLevel, 1, 5) }, // inverted: lower stress = better
    { subject: "Cycle", value: normalize(data.cycleLength, 15, 60) },
    { subject: "Missed", value: normalize(12 - data.missedPeriods, 0, 12) }, // inverted
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium text-[#3A3A4A] mb-4">Health Insights Overview</h2>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#f0d0d8" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B6B7A", fontSize: 12 }} />
          <Radar
            name="Health"
            dataKey="value"
            stroke="#E76F8A"
            fill="#E76F8A"
            fillOpacity={0.3}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #f0d0d8" }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-[#9A9AA8] mt-2">
        Scores are normalized — higher is generally better
      </p>
    </Card>
  );
}

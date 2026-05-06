"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";

interface OnboardingData {
  bmi: number;
  stressLevel: number;
  sleepHours: number;
  activityLevel: string;
  cycleRegularity: string;
  missedPeriods: number;
  acneSeverity: string;
  hairLoss: boolean;
  excessHair: boolean;
  familyHistory: boolean;
  thyroidOrDiabetes: boolean;
}

function generateGuidance(d: OnboardingData) {
  const tips: { title: string; description: string }[] = [];

  // BMI
  if (d.bmi < 18.5) {
    tips.push({ title: "Nutrition", description: "Your BMI is low. Focus on nutrient-rich foods and consult a dietitian." });
  } else if (d.bmi >= 25) {
    tips.push({ title: "Weight Management", description: "A balanced diet and regular movement can help manage your weight and hormone levels." });
  } else {
    tips.push({ title: "Weight", description: "Your BMI is in a healthy range. Keep maintaining your current habits." });
  }

  // Sleep
  if (d.sleepHours < 6) {
    tips.push({ title: "Sleep", description: "You're getting less than 6 hours of sleep. Poor sleep can worsen hormonal imbalance — aim for 7–9 hours." });
  } else if (d.sleepHours >= 7) {
    tips.push({ title: "Sleep", description: "Great sleep habits! Consistent rest supports hormonal health." });
  }

  // Stress
  if (d.stressLevel >= 4) {
    tips.push({ title: "Stress Management", description: "High stress can disrupt your cycle. Try breathing exercises, journaling, or light yoga daily." });
  }

  // Activity
  if (d.activityLevel === "Low") {
    tips.push({ title: "Physical Activity", description: "Even 20–30 minutes of walking daily can improve insulin sensitivity and cycle regularity." });
  } else if (d.activityLevel === "High") {
    tips.push({ title: "Exercise Balance", description: "High activity is great, but over-exercising can affect your cycle. Listen to your body." });
  }

  // Cycle
  if (d.cycleRegularity === "Irregular" || d.missedPeriods > 2) {
    tips.push({ title: "Cycle Health", description: "Irregular cycles or missed periods may need attention. Track your cycle and consult a gynecologist." });
  }

  // Symptoms
  if (d.acneSeverity === "Severe" || d.excessHair || d.hairLoss) {
    tips.push({ title: "Hormonal Symptoms", description: "Acne, excess hair, or hair loss can be signs of hormonal imbalance. A doctor can check your androgen levels." });
  }

  // Family history
  if (d.familyHistory || d.thyroidOrDiabetes) {
    tips.push({ title: "Medical Check-up", description: "Given your family history or existing conditions, regular check-ups with your doctor are important." });
  }

  // Default fallback
  if (tips.length === 0) {
    tips.push({ title: "Keep it up", description: "Your health indicators look good. Stay consistent with your lifestyle habits." });
  }

  return tips;
}

export default function Recommendations() {
  const { token } = useAuth();
  const [tips, setTips] = useState<{ title: string; description: string }[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/onboarding", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setTips(generateGuidance(res.data));
      })
      .catch(() => {});
  }, [token]);

  if (tips.length === 0) return null;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-medium text-[#3A3A4A]">Supportive Guidance</h2>
      {tips.map((item) => (
        <div key={item.title} className="border-l-2 border-[#E76F8A] pl-3">
          <p className="font-medium text-sm text-[#4A4A5A]">{item.title}</p>
          <p className="text-sm text-[#6B6B7A]">{item.description}</p>
        </div>
      ))}
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export default function GreetingCard() {
  const { token } = useAuth();
  const [displayName, setDisplayName] = useState("there");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.email) {
          setDisplayName(data.email.split("@")[0]);
        }
      })
      .catch(() => {});
  }, [token]);

  return (
    <Card className="p-6 bg-[#FFEFF4]">
      <h1 className="text-2xl font-semibold text-[#3A3A4A]">
        Hello, {displayName} 🌸
      </h1>
      <p className="text-sm text-[#6B6B7A] mt-1">
        Here's a gentle overview of your health journey so far.
      </p>
    </Card>
  );
}

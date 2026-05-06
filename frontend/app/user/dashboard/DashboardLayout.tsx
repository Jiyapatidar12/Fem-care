"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import GreetingCard from "././components/GreetingCard";
import HealthSnapshot from "././components/HealthSnapshot";
import InsightsChart from "././components/InsightsChart";
import Recommendations from "././components/Recommendations";
import ChatbotMock from "././components/ChatbotMock";
import PCOSRiskCard from "././components/PCOSRiskCard";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#FFF9FB]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <span className="text-[#E76F8A] font-semibold text-lg">FemCare</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/onboarding")}
            className="text-sm text-[#6B6B7A] hover:text-[#E76F8A] border border-gray-200 hover:border-[#E76F8A] px-4 py-1.5 rounded-full transition-all"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-[#6B6B7A] hover:text-[#E76F8A] border border-gray-200 hover:border-[#E76F8A] px-4 py-1.5 rounded-full transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <GreetingCard />
        <PCOSRiskCard />
        <HealthSnapshot />
        <InsightsChart />
        <Recommendations />
        <ChatbotMock />
      </div>
    </main>
  );
}

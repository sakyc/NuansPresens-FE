"use client";

import { useState } from "react";
import { BottomNavigation, type TabType } from "./bottom-navigation";
import { HomeTab } from "./home-tab";
import { ScanTab } from "./scan-tab";
import { RequestTab } from "./request-tab";
import { ProfileTab } from "./profile-tab";
import { ActivityHistory } from "./activity-history";
import { RequestHistory } from "./request-history";

type ViewType = "main" | "activity-history" | "request-history";

export function EmployeeApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [currentView, setCurrentView] = useState<ViewType>("main");

  const getPageTitle = () => {
    if (currentView === "activity-history") return "Riwayat Aktivitas";
    if (currentView === "request-history") return "Riwayat Pengajuan";
    
    switch (activeTab) {
      case "home":
        return "Beranda";
      case "scan":
        return "Scan QR";
      case "request":
        return "Pengajuan";
      case "profile":
        return "Profil";
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentView("main");
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-lg safe-area-top">
        <div className="mx-auto flex h-14 max-w-md items-center justify-center px-4">
          <h1 className="text-base font-semibold text-foreground">{getPageTitle()}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-md px-4 py-5">
          {currentView === "activity-history" && (
            <ActivityHistory onBack={() => setCurrentView("main")} />
          )}
          {currentView === "request-history" && (
            <RequestHistory onBack={() => setCurrentView("main")} />
          )}
          {currentView === "main" && (
            <>
              {activeTab === "home" && (
                <HomeTab onViewAllActivity={() => setCurrentView("activity-history")} />
              )}
              {activeTab === "scan" && <ScanTab />}
              {activeTab === "request" && (
                <RequestTab onViewAllHistory={() => setCurrentView("request-history")} />
              )}
              {activeTab === "profile" && <ProfileTab />}
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

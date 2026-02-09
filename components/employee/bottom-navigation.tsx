"use client";

import { Home, ScanLine, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "home" | "scan" | "request" | "profile";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "scan" as const, label: "Scan", icon: ScanLine },
  { id: "request" as const, label: "Request", icon: FileText },
  { id: "profile" as const, label: "Profile", icon: User },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200",
                isActive
                  ? "bg-success/15 text-success"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative rounded-lg p-1.5 transition-all duration-200",
                isActive && "bg-success/20"
              )}>
                <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium tracking-wide",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

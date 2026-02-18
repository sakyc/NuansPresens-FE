"use client";

import React from "react"

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

const recentActivity = [
  { id: 1, type: "masuk", date: "Hari ini", time: "08:02", status: "success" },
  { id: 2, type: "keluar", date: "Kemarin", time: "17:05", status: "success" },
  { id: 3, type: "masuk", date: "Kemarin", time: "08:15", status: "late" },
  { id: 4, type: "izin", date: "3 hari lalu", time: "-", status: "approved" },
  { id: 5, type: "masuk", date: "4 hari lalu", time: "07:58", status: "success" },
];

interface HomeTabProps {
  onViewAllActivity?: () => void;
}

export function HomeTab({ onViewAllActivity }: HomeTabProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "late":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
      default:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "masuk":
        return { label: "Masuk", color: "bg-success/20 text-success" };
      case "keluar":
        return { label: "Keluar", color: "bg-orange-500/20 text-orange-400" };
      case "izin":
        return { label: "Izin", color: "bg-blue-500/20 text-blue-400" };
      default:
        return { label: type, color: "bg-muted text-muted-foreground" };
    }
  };

  const {data: session} = useSession();

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Profile Header */}
      <Card className="border-0 bg-gradient-to-br from-success/20 via-card to-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-success/30 ring-offset-2 ring-offset-background">
              <AvatarImage src="" alt="Employee" />
              <AvatarFallback className="bg-success/20 text-success text-lg font-semibold">
                BA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{session?.user.karyawan?.nama}</h2>
              <p className="text-sm text-muted-foreground">Software Engineer</p>
              <div className="mt-1 flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">IT Department</span>
              </div>
            </div>
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
              Aktif
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time Card */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-accent p-3">
                <Calendar className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tanggal</p>
                <p className="text-sm font-medium text-foreground">{formatDate(currentTime)}</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Waktu</p>
                <p className="font-mono text-lg font-bold text-success">{formatTime(currentTime)}</p>
              </div>
              <div className="rounded-xl bg-success/15 p-3">
                <Clock className="h-5 w-5 text-success" />
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-success/15">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-xl font-bold text-foreground">22</p>
            <p className="text-[10px] text-muted-foreground">Hadir</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-warning/15">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <p className="text-xl font-bold text-foreground">2</p>
            <p className="text-[10px] text-muted-foreground">Terlambat</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-foreground">1</p>
            <p className="text-[10px] text-muted-foreground">Izin</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-foreground">Aktivitas Terbaru</h3>
          <button 
            type="button" 
            onClick={onViewAllActivity}
            className="flex items-center gap-1 text-xs text-success hover:underline"
          >
            Lihat Semua
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border/50 p-0">
            {recentActivity.map((activity) => {
              const typeInfo = getTypeLabel(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-3 p-4">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`${typeInfo.color} text-[10px] font-medium`}>
                        {typeInfo.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

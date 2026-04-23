"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Filter,
  Calendar,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ActivityHistoryProps {
  onBack: () => void;
}

const allActivity = [
  { id: 1, type: "masuk", date: "Hari ini", fullDate: "4 Feb 2025", time: "08:02", status: "success" },
  { id: 2, type: "keluar", date: "Kemarin", fullDate: "3 Feb 2025", time: "17:05", status: "success" },
  { id: 3, type: "masuk", date: "Kemarin", fullDate: "3 Feb 2025", time: "08:15", status: "late" },
  { id: 4, type: "izin", date: "3 hari lalu", fullDate: "1 Feb 2025", time: "-", status: "approved" },
  { id: 5, type: "masuk", date: "4 hari lalu", fullDate: "31 Jan 2025", time: "07:58", status: "success" },
  { id: 6, type: "keluar", date: "4 hari lalu", fullDate: "31 Jan 2025", time: "17:00", status: "success" },
  { id: 7, type: "masuk", date: "5 hari lalu", fullDate: "30 Jan 2025", time: "08:05", status: "success" },
  { id: 8, type: "keluar", date: "5 hari lalu", fullDate: "30 Jan 2025", time: "17:10", status: "success" },
  { id: 9, type: "masuk", date: "6 hari lalu", fullDate: "29 Jan 2025", time: "08:30", status: "late" },
  { id: 10, type: "keluar", date: "6 hari lalu", fullDate: "29 Jan 2025", time: "17:02", status: "success" },
  { id: 11, type: "sakit", date: "1 minggu lalu", fullDate: "28 Jan 2025", time: "-", status: "approved" },
  { id: 12, type: "masuk", date: "10 hari lalu", fullDate: "25 Jan 2025", time: "07:55", status: "success" },
  { id: 13, type: "keluar", date: "10 hari lalu", fullDate: "25 Jan 2025", time: "17:08", status: "success" },
  { id: 14, type: "masuk", date: "11 hari lalu", fullDate: "24 Jan 2025", time: "08:00", status: "success" },
  { id: 15, type: "keluar", date: "11 hari lalu", fullDate: "24 Jan 2025", time: "16:55", status: "success" },
];

type FilterType = "all" | "masuk" | "keluar" | "izin" | "sakit";

export function ActivityHistory({ onBack }: ActivityHistoryProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivity = allActivity.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = 
      item.fullDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "late":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-blue-400" />;
      default:
        return <XCircle className="h-5 w-5 text-destructive" />;
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
      case "sakit":
        return { label: "Sakit", color: "bg-destructive/20 text-destructive" };
      default:
        return { label: type, color: "bg-muted text-muted-foreground" };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Tepat Waktu";
      case "late":
        return "Terlambat";
      case "approved":
        return "Disetujui";
      default:
        return status;
    }
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "masuk", label: "Masuk" },
    { value: "keluar", label: "Keluar" },
    { value: "izin", label: "Izin" },
    { value: "sakit", label: "Sakit" },
  ];

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Riwayat Aktivitas</h2>
          <p className="text-xs text-muted-foreground">{filteredActivity.length} aktivitas ditemukan</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari tanggal atau tipe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border-border bg-card pl-10"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              filter === f.value
                ? "bg-success text-success-foreground"
                : "bg-card text-muted-foreground hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <Card className="border-border/50">
        <CardContent className="divide-y divide-border/50 p-0">
          {filteredActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Tidak ada aktivitas ditemukan</p>
            </div>
          ) : (
            filteredActivity.map((activity) => {
              const typeInfo = getTypeLabel(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`${typeInfo.color} text-xs font-medium`}>
                        {typeInfo.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {activity.fullDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-semibold text-foreground">
                      {activity.time}
                    </span>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

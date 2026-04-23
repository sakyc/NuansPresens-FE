"use client";

import { useState } from "react";
import {
  Thermometer,
  FileText,
  ArrowLeft,
  Filter,
  Calendar,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RequestHistoryProps {
  onBack: () => void;
}

const allRequests = [
  { 
    id: 1, 
    type: "sakit", 
    dateRange: "10 Jan 2025", 
    status: "approved", 
    reason: "Demam tinggi dan flu berat, perlu istirahat di rumah",
    submittedAt: "9 Jan 2025, 20:30",
    approvedBy: "Pak Ahmad",
    approvedAt: "10 Jan 2025, 07:15"
  },
  { 
    id: 2, 
    type: "izin", 
    dateRange: "5 Jan 2025", 
    status: "approved", 
    reason: "Menghadiri acara pernikahan saudara di luar kota",
    submittedAt: "3 Jan 2025, 14:00",
    approvedBy: "Bu Siti",
    approvedAt: "4 Jan 2025, 09:00"
  },
  { 
    id: 3, 
    type: "izin", 
    dateRange: "28 Dec 2024", 
    status: "rejected", 
    reason: "Keperluan pribadi mendadak",
    submittedAt: "27 Dec 2024, 18:45",
    rejectedReason: "Pengajuan terlalu mendadak"
  },
  { 
    id: 4, 
    type: "sakit", 
    dateRange: "15-16 Dec 2024", 
    status: "approved", 
    reason: "Sakit perut dan diare",
    submittedAt: "15 Dec 2024, 06:00",
    approvedBy: "Pak Ahmad",
    approvedAt: "15 Dec 2024, 07:30"
  },
  { 
    id: 5, 
    type: "izin", 
    dateRange: "1 Dec 2024", 
    status: "approved", 
    reason: "Mengurus perpanjangan SIM",
    submittedAt: "28 Nov 2024, 10:00",
    approvedBy: "Bu Siti",
    approvedAt: "29 Nov 2024, 08:00"
  },
  { 
    id: 6, 
    type: "sakit", 
    dateRange: "20-22 Nov 2024", 
    status: "approved", 
    reason: "Operasi gigi bungsu dan pemulihan",
    submittedAt: "19 Nov 2024, 15:00",
    approvedBy: "Pak Ahmad",
    approvedAt: "19 Nov 2024, 16:00"
  },
  { 
    id: 7, 
    type: "izin", 
    dateRange: "5 Nov 2024", 
    status: "pending", 
    reason: "Mengikuti wisuda adik",
    submittedAt: "1 Nov 2024, 12:00"
  },
];

type FilterType = "all" | "sakit" | "izin";
type StatusFilter = "all" | "approved" | "rejected" | "pending";

export function RequestHistory({ onBack }: RequestHistoryProps) {
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredRequests = allRequests.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dateRange.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success/20 text-success gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Disetujui
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/20 text-destructive gap-1">
            <XCircle className="h-3 w-3" />
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-warning/20 text-warning gap-1">
            <Hourglass className="h-3 w-3" />
            Menunggu
          </Badge>
        );
    }
  };

  const typeFilters: { value: FilterType; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "sakit", label: "Sakit" },
    { value: "izin", label: "Izin" },
  ];

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "approved", label: "Disetujui" },
    { value: "pending", label: "Menunggu" },
    { value: "rejected", label: "Ditolak" },
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
          <h2 className="text-lg font-semibold text-foreground">Riwayat Pengajuan</h2>
          <p className="text-xs text-muted-foreground">{filteredRequests.length} pengajuan ditemukan</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari alasan atau tanggal..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border-border bg-card pl-10"
        />
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
        {typeFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTypeFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              typeFilter === f.value
                ? f.value === "sakit"
                  ? "bg-destructive text-white"
                  : f.value === "izin"
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground"
                : "bg-card text-muted-foreground hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-muted-foreground shrink-0">Status:</span>
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              statusFilter === f.value
                ? "bg-foreground text-background"
                : "bg-card text-muted-foreground hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="flex flex-col gap-3">
        {filteredRequests.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Tidak ada pengajuan ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((item) => (
            <Card key={item.id} className="border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded-xl p-2.5",
                      item.type === "sakit" ? "bg-destructive/15" : "bg-warning/15"
                    )}
                  >
                    {item.type === "sakit" ? (
                      <Thermometer className="h-5 w-5 text-destructive" />
                    ) : (
                      <FileText className="h-5 w-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground capitalize">
                        {item.type}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {item.reason}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.dateRange}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      expandedId === item.id && "rotate-90"
                    )}
                  />
                </button>

                {/* Expanded Details */}
                {expandedId === item.id && (
                  <div className="border-t border-border/50 bg-accent/30 px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Diajukan:</span>
                      <span className="text-foreground">{item.submittedAt}</span>
                    </div>
                    {item.status === "approved" && (
                      <>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          <span className="text-muted-foreground">Disetujui oleh:</span>
                          <span className="text-foreground">{item.approvedBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Waktu persetujuan:</span>
                          <span className="text-foreground">{item.approvedAt}</span>
                        </div>
                      </>
                    )}
                    {item.status === "rejected" && item.rejectedReason && (
                      <div className="flex items-start gap-2 text-xs">
                        <XCircle className="h-3.5 w-3.5 text-destructive mt-0.5" />
                        <span className="text-muted-foreground">Alasan ditolak:</span>
                        <span className="text-destructive">{item.rejectedReason}</span>
                      </div>
                    )}
                    {item.status === "pending" && (
                      <div className="flex items-center gap-2 text-xs">
                        <Hourglass className="h-3.5 w-3.5 text-warning" />
                        <span className="text-warning">Menunggu persetujuan atasan</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

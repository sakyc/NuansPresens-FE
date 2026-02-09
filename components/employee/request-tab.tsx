"use client";

import React from "react"

import { useState } from "react";
import { 
  Thermometer, 
  FileText, 
  Calendar as CalendarIcon, 
  Send,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Clock,
  ImagePlus,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type RequestType = "sakit" | "izin";

const requestHistory = [
  { id: 1, type: "sakit", date: "10 Jan 2025", status: "approved", reason: "Demam dan flu" },
  { id: 2, type: "izin", date: "5 Jan 2025", status: "approved", reason: "Acara keluarga" },
  { id: 3, type: "izin", date: "28 Dec 2024", status: "rejected", reason: "Keperluan pribadi" },
];

interface RequestTabProps {
  onViewAllHistory?: () => void;
}

export function RequestTab({ onViewAllHistory }: RequestTabProps) {
  const [requestType, setRequestType] = useState<RequestType>("sakit");
  const [date, setDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!date || !reason.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setDate(undefined);
        setEndDate(undefined);
        setReason("");
        setImagePreview(null);
      }, 2000);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/20 text-success">Disetujui</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/20 text-destructive">Ditolak</Badge>;
      default:
        return <Badge className="bg-warning/20 text-warning">Menunggu</Badge>;
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <div className="rounded-full bg-success/20 p-6">
          <CheckCircle2 className="h-16 w-16 text-success" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">Pengajuan Terkirim!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pengajuan {requestType === "sakit" ? "sakit" : "izin"} Anda sedang diproses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Request Type Toggle */}
      <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5">
        <button
          type="button"
          onClick={() => setRequestType("sakit")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            requestType === "sakit"
              ? "bg-destructive/90 text-white shadow-lg shadow-destructive/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Thermometer className="h-4 w-4" />
          Sakit
        </button>
        <button
          type="button"
          onClick={() => setRequestType("izin")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            requestType === "izin"
              ? "bg-warning text-warning-foreground shadow-lg shadow-warning/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          Izin
        </button>
      </div>

      {/* Request Form */}
      <Card className="border-border/50">
        <CardContent className="space-y-5 p-5">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Tanggal Mulai
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start rounded-xl border-border bg-input text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Tanggal Selesai (Opsional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start rounded-xl border-border bg-input text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: id }) : "Pilih tanggal selesai"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(d) => (date ? d < date : false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Alasan {requestType === "sakit" ? "Sakit" : "Izin"}
            </Label>
            <Textarea
              placeholder={
                requestType === "sakit"
                  ? "Contoh: Demam tinggi dan perlu istirahat..."
                  : "Contoh: Menghadiri acara pernikahan keluarga..."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] resize-none rounded-xl border-border bg-input"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Bukti Pendukung
              <span className="ml-1 text-xs font-normal text-muted-foreground">(Opsional)</span>
            </Label>
            
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-border bg-input">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview bukti"
                  className="h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-xs text-white">Tap X untuk menghapus gambar</p>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-input/50 p-6 transition-colors hover:border-muted-foreground/50 hover:bg-input">
                <div className={cn(
                  "rounded-full p-3",
                  requestType === "sakit" ? "bg-destructive/15" : "bg-warning/15"
                )}>
                  <ImagePlus className={cn(
                    "h-6 w-6",
                    requestType === "sakit" ? "text-destructive" : "text-warning"
                  )} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Upload Bukti
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {requestType === "sakit" 
                      ? "Surat dokter, hasil lab, atau foto resep obat"
                      : "Undangan, surat keterangan, atau dokumen pendukung"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className={cn(
              "w-full rounded-xl py-6 text-base font-semibold",
              requestType === "sakit"
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-warning hover:bg-warning/90 text-warning-foreground"
            )}
            onClick={handleSubmit}
            disabled={!date || !reason.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Kirim Pengajuan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Request History */}
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Pengajuan</h3>
          <button 
            type="button" 
            onClick={onViewAllHistory}
            className="flex items-center gap-1 text-xs text-success hover:underline"
          >
            Lihat Semua
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border/50 p-0">
            {requestHistory.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-4">
                <div className={cn(
                  "mt-0.5 rounded-lg p-2",
                  item.type === "sakit" ? "bg-destructive/15" : "bg-warning/15"
                )}>
                  {item.type === "sakit" ? (
                    <Thermometer className={cn("h-4 w-4", "text-destructive")} />
                  ) : (
                    <FileText className={cn("h-4 w-4", "text-warning")} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {item.type}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {item.reason}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

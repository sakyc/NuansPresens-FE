"use client";

import React, { useEffect, useState, useRef } from "react";
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
  X,
  AlertCircle
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSession } from "next-auth/react";

type RequestType = "sakit" | "cuti" | "izin" | "pulang_cepat";

const KebutuhanPengajuan = {
  sakit: { 
    bg_color: "bg-destructive", 
    bg_color_mudar: "bg-destructive/15", 
    textColor: "text-destructive", 
    id: 1, 
    label: "Sakit",
    placeholder: "Contoh: Demam tinggi dan perlu istirahat...",
    hint: "Surat dokter, hasil lab, atau foto resep obat" 
  },
  izin: { 
    bg_color: "bg-warning", 
    bg_color_mudar: "bg-warning/15", 
    textColor: "text-warning", 
    id: 2, 
    label: "Izin",
    placeholder: "Contoh: Menghadiri acara pernikahan keluarga...",
    hint: "Undangan, surat keterangan, atau dokumen pendukung" 
  },
  cuti: { 
    bg_color: "bg-success", 
    bg_color_mudar: "bg-success/15", 
    textColor: "text-success", 
    id: 3, 
    label: "Cuti",
    placeholder: "Contoh: Ingin mengambil cuti tahunan untuk liburan...",
    hint: "Surat persetujuan cuti atau jadwal liburan" 
  },
  pulang_cepat: { 
    bg_color: "bg-info", 
    bg_color_mudar: "bg-info/15", 
    textColor: "text-info", 
    id: 4, 
    label: "Pulang Cepat",
    placeholder: "Contoh: Ada keperluan mendadak di rumah...",
    hint: "Surat izin atasan atau keterangan keperluan mendesak" 
  },
};

type SubmissionStatus = "idle" | "loading" | "success" | "error";

interface SubmissionResponse {
  status: "berhasil" | "gagal";
  message: string;
  data?: Record<string, unknown>;
}

interface RequestTabProps {
  onViewAllHistory?: () => void;
}

const requestHistory = [
  { id: 1, type: "sakit", date: "10 Jan 2025", status: "approved", reason: "Demam dan flu" },
  { id: 2, type: "cuti", date: "5 Jan 2025", status: "approved", reason: "Acara keluarga" },
  { id: 3, type: "cuti", date: "28 Dec 2024", status: "rejected", reason: "Keperluan pribadi" },
];

export function RequestTab({ onViewAllHistory }: RequestTabProps) {
  const { data: session } = useSession();

  const [requestType, setRequestType] = useState<RequestType>("sakit");
  const [date, setDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");

  const [submissionMessage, setSubmissionMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const dataPengajuan = KebutuhanPengajuan[requestType];
  const ColorButtonPengajuan = false
  let KeteranganBukti = KebutuhanPengajuan[requestType].hint
  let KeteranganAlesan = KebutuhanPengajuan[requestType].placeholder
  

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const slideWidth = el.offsetWidth;
      const index = Math.round(el.scrollLeft / slideWidth);
      setActiveSlide(index);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!date || !reason.trim()) return;

    setSubmissionStatus("loading");
    setShowModal(true);

    try {
      const res = await fetch(
        "https://jeramy-silty-stasia.ngrok-free.dev/api/absensi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            karyawan_id: session?.user?.id,
            shift_id: session?.user?.karyawan?.shift?.id,
            kategory_absensi_id: dataPengajuan.id,
            tanggal_mulai: date,
            tanggal_selesai: endDate,
            keterangan: reason,
            foto: imagePreview ?? null,
          }),
        }
      );

      const data: SubmissionResponse = await res.json();

      if (res.ok) {
        setSubmissionStatus("success");
        setSubmissionMessage(data.message || "Pengajuan berhasil dikirim");

        setTimeout(() => {
          setShowModal(false);
          setSubmissionStatus("idle");
          setSubmissionMessage("");

          setDate(undefined);
          setEndDate(undefined);
          setReason("");
          setImagePreview(null);
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage(data.message || "Pengajuan gagal");
      }
    } catch (error) {
      console.error("Submit error:", error);

      setSubmissionStatus("error");
      setSubmissionMessage("Terjadi kesalahan saat menghubungi server");
    }
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

  return (
    <div className="flex flex-col gap-5 pb-24">

      {/* TYPE SELECTOR */}
      <div className="space-y-3">

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          <div className="min-w-full snap-center">
            <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5">

              <button
                onClick={() => setRequestType("sakit")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                  requestType === "sakit"
                    ? `${dataPengajuan.bg_color} text-white`
                    : "text-muted-foreground"
                )}
              >
                <Thermometer className="h-4 w-4" />
                Sakit
              </button>

              <button
                onClick={() => setRequestType("izin")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                  requestType === "izin"
                    ? `${dataPengajuan.bg_color} text-white`
                    : "text-muted-foreground"
                )}
              >
                <FileText className="h-4 w-4" />
                Izin
              </button>

            </div>
          </div>

          <div className="min-w-full snap-center">
            <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5">

              <button
                onClick={() => setRequestType("cuti")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                  requestType === "cuti"
                    ? `${dataPengajuan.bg_color} text-white`
                    : "text-muted-foreground"
                )}
              >
                <FileText className="h-4 w-4" />
                Cuti
              </button>

              <button
                onClick={() => setRequestType("pulang_cepat")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                  requestType === "pulang_cepat"
                    ? `${dataPengajuan.bg_color} text-white`
                    : "text-muted-foreground"
                )}
              >
                <FileText className="h-4 w-4" />
                Pulang cepat
              </button>
            </div>
          </div>
        </div>

        {/* DOT */}
        <div className="flex justify-center gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full bg-white/40",
                activeSlide === i && "w-4 bg-white"
              )}
            />
          ))}
        </div>
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

          {/* a;esam */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Alasan {dataPengajuan.label}
            </Label>
            <Textarea
              placeholder={
                KeteranganAlesan
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
                <div className={`rounded-full p-3 ${dataPengajuan.bg_color_mudar}`}>
                  <ImagePlus className={`h-6 w-6 ${dataPengajuan.textColor}` } />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Upload Bukti
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {KeteranganBukti}
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

          {/* SUBMIT */}
          <Button
            onClick={handleSubmit}
            disabled={!date || !reason.trim() || submissionStatus === "loading"}
            className={cn("w-full py-6 text-base font-semibold", 
              !ColorButtonPengajuan
                    ? `${dataPengajuan.bg_color} text-white`
                    : ""
            )}
          >
            {submissionStatus === "loading" ? (
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

      {/* HISTORY */}
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

      {/* MODAL STATUS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl">

            {submissionStatus === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin" />

                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    Mengirim Pengajuan
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Harap tunggu...
                  </p>
                </div>
              </div>
            )}

            {submissionStatus === "success" && (
              <div className="flex flex-col items-center gap-4">

                <CheckCircle2 className="h-12 w-12 text-success" />

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-success">
                    Berhasil!
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {submissionMessage}
                  </p>
                </div>

              </div>
            )}

            {submissionStatus === "error" && (
              <div className="flex flex-col items-center gap-4">

                <AlertCircle className="h-12 w-12 text-destructive" />

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive">
                    Gagal
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {submissionMessage}
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </Button>

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
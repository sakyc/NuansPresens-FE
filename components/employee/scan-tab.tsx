"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, LogIn, LogOut, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

type ScanMode = "checkin" | "checkout";
type SubmissionStatus = "idle" | "loading" | "success" | "error";

interface SubmissionResponse {
  status: "success" | "error";
  code: number;
  message: string;
  data?: Record<string, unknown>;
}

export function ScanTab() {
  const [scanMode, setScanMode] = useState<ScanMode>("checkin");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const session = useSession();
  const type = scanMode === "checkin" ? "masuk" : "keluar";

  const submitPresensi = async (token: string) => {
    setSubmissionStatus("loading");
    setShowModal(true);
    
    try {
      const response = await fetch("https://jeramy-silty-stasia.ngrok-free.dev/api/presensi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_karyawan: session.data?.user?.karyawan?.id,
          type: type,
          token: token,
        }),
      });

      const data: SubmissionResponse = await response.json();

      if (response.ok && response.status === 200) {
        setSubmissionStatus("success");
        setSubmissionMessage(data.message || "Presensi berhasil dicatat!");
        
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowModal(false);
          setScannedData(null);
          setSubmissionStatus("idle");
          setSubmissionMessage("");
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage(data.message || "Gagal mencatat presensi");
      }
    } catch (error) {
      console.log("[v0] API error:", error);
      setSubmissionStatus("error");
      setSubmissionMessage("Terjadi kesalahan saat menghubungi server");
    }
  };

  const startScanner = async () => {
    setScannedData(null);
    setSubmissionStatus("idle");
    setSubmissionMessage("");
    setIsScanning(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScannedData(decodedText);
          scanner.stop().catch(() => {});
          setIsScanning(false);
          setTimeout(() => {
            submitPresensi(decodedText);
          }, 500);
        },
        () => {}
      );
    } catch (err) {
      console.log("[v0] Scanner error:", err);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        // Ignore stop errors
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setScannedData(null);
    setSubmissionStatus("idle");
    setSubmissionMessage("");
  };

 // Cleanup on unmount
useEffect(() => {
  return () => {
    if (scannerRef.current) {
      // Cek dulu apakah masih scanning sebelum stop
      if (scannerRef.current.getState() === 2) { // 2 = sedang scanning
        scannerRef.current.stop().catch(() => {});
      }
    }
  };
}, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5">
        <button
          type="button"
          onClick={() => setScanMode("checkin")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            scanMode === "checkin"
              ? "bg-success text-success-foreground shadow-lg shadow-success/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogIn className="h-4 w-4" />
          Check-In
        </button>
        <button
          type="button"
          onClick={() => setScanMode("checkout")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            scanMode === "checkout"
              ? "bg-warning text-warning-foreground shadow-lg shadow-warning/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogOut className="h-4 w-4" />
          Check-Out
        </button>
      </div>

      {/* Scanner Area */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-black">
        {isScanning ? (
          <>
            <div
              id="qr-reader"
              className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-64 w-64">
                <div className={cn("absolute top-0 left-0 h-12 w-12 border-t-4 border-l-4 rounded-tl-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
                <div className={cn("absolute top-0 right-0 h-12 w-12 border-t-4 border-r-4 rounded-tr-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
                <div className={cn("absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 rounded-bl-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
                <div className={cn("absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 rounded-br-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
              </div>
            </div>
            <button
              type="button"
              onClick={stopScanner}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 px-6 py-3 text-white backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
              Tutup
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
            <div className={cn("rounded-3xl p-6", scanMode === "checkin" ? "bg-success/20" : "bg-warning/20")}>
              <Camera className={cn("h-16 w-16", scanMode === "checkin" ? "text-success" : "text-warning")} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Scan QR Code</h3>
              <p className="mt-1 text-sm text-white/60">Tekan tombol di bawah untuk memulai</p>
            </div>
            <button
              type="button"
              onClick={startScanner}
              className={cn(
                "flex items-center gap-2 rounded-xl px-8 py-3 font-semibold",
                scanMode === "checkin"
                  ? "bg-success text-success-foreground"
                  : "bg-warning text-warning-foreground"
              )}
            >
              <Camera className="h-5 w-5" />
              Buka Kamera
            </button>
            
            {/* Manual Token Input */}
            <div className="w-full mt-4 pt-4 border-t border-white/10">
              <p className="text-sm font-medium text-white/80 mb-3">Atau masukkan token manual:</p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const token = formData.get("token") as string;
                  if (token?.trim()) {
                    submitPresensi(token);
                    e.currentTarget.reset();
                  }
                }} 
                className="flex gap-2"
              >
                <input
                  type="text"
                  name="token"
                  placeholder="Masukkan token..."
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  disabled={submissionStatus === "loading"}
                  className={cn(
                    "rounded-xl px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    scanMode === "checkin"
                      ? "bg-success text-success-foreground hover:bg-success/90"
                      : "bg-warning text-warning-foreground hover:bg-warning/90"
                  )}
                >
                  {submissionStatus === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Scanned QR Data */}
      {scannedData && (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
          <p className="text-xs text-muted-foreground mb-2">QR Code terdeteksi:</p>
          <p className="text-sm font-mono text-foreground break-all">{scannedData}</p>
        </div>
      )}

      {/* Modal Status */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl">
            {submissionStatus === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-accent/20 p-4">
                  <Loader2 className="h-12 w-12 text-accent animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">Memproses Presensi</h3>
                  <p className="text-sm text-muted-foreground mt-1">Harap tunggu sebentar...</p>
                </div>
              </div>
            )}

            {submissionStatus === "success" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-success/20 p-4">
                  <Check className="h-12 w-12 text-success" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-success">Berhasil!</h3>
                  <p className="text-sm text-muted-foreground mt-1">{submissionMessage}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {scanMode === "checkin" ? "Selamat datang!" : "Sampai jumpa besok!"}
                  </p>
                </div>
              </div>
            )}

            {submissionStatus === "error" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-destructive/20 p-4">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive">Gagal!</h3>
                  <p className="text-sm text-muted-foreground mt-1">{submissionMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-2 w-full rounded-xl bg-destructive/20 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/30 transition-colors"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
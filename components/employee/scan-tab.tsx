"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, LogIn, LogOut, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmployeeData } from "@/lib/employee-storage";

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
  const [employeeData, setEmployeeData] = useState<ReturnType<typeof getEmployeeData>>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Load employee data from localStorage
  // useEffect(() => {
  //   const data = getEmployeeData();
  //   setEmployeeData(data);
  // }, []);

  const submitPresensi = async (token: string) => {
    // if (!employeeData) {
    //   setSubmissionStatus("error");
    //   setSubmissionMessage("Data karyawan tidak ditemukan. Silakan login kembali.");
    //   return;
    // }

    setSubmissionStatus("loading");
    try {
      const response = await fetch("https://jeramy-silty-stasia.ngrok-free.dev/api/presensi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_karyawan: 1,
          karyawan_shift: 1,
          curent_shift: 1, // ID shift saat ini
          token: "701d2e3960a3772ab3794265",
        }),
      });

      const data: SubmissionResponse = await response.json();

      if (response.ok && data.status === "success") {
        setSubmissionStatus("success");
        setSubmissionMessage(data.message || "Presensi berhasil dicatat!");
        // Reset after 3 seconds
        setTimeout(() => {
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

    // Wait for DOM to render the container
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
          // QR scanned - show result and prepare submission
          setScannedData(decodedText);
          scanner.stop().catch(() => {});
          setIsScanning(false);
          // Automatically submit after a brief delay
          setTimeout(() => {
            submitPresensi(decodedText);
          }, 500);
        },
        () => {
          // Ignore scan errors (no QR in frame)
        }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
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
            {/* Camera view */}
            <div
              id="qr-reader"
              className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
            />

            {/* Viewfinder overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-64 w-64">
                <div className={cn("absolute top-0 left-0 h-12 w-12 border-t-4 border-l-4 rounded-tl-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
                <div className={cn("absolute top-0 right-0 h-12 w-12 border-t-4 border-r-4 rounded-tr-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
                <div className={cn("absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 rounded-bl-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
                <div className={cn("absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 rounded-br-2xl", scanMode === "checkin" ? "border-success" : "border-warning")} />
              </div>
            </div>

            {/* Stop button */}
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
          </div>
        )}
      </div>

      {/* Scanned Result & Submission Status */}
      {scannedData && (
        <div className="space-y-3">
          {/* Scanned QR Data */}
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
            <p className="text-xs text-muted-foreground mb-2">QR Code:</p>
            <p className="text-sm font-mono text-foreground break-all">{scannedData}</p>
          </div>

          {/* Loading State */}
          {submissionStatus === "loading" && (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Memproses Presensi...</p>
                <p className="text-xs text-muted-foreground mt-1">Harap tunggu sebentar</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {submissionStatus === "success" && (
            <div className="rounded-2xl border border-success/50 bg-success/20 p-6 flex flex-col items-center gap-3">
              <div className="rounded-full bg-success/30 p-3">
                <Check className="h-8 w-8 text-success" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-success">{submissionMessage}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {scanMode === "checkin" ? "Selamat datang!" : "Sampai jumpa besok!"}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {submissionStatus === "error" && (
            <div className="rounded-2xl border border-destructive/50 bg-destructive/20 p-6 flex flex-col items-center gap-3">
              <div className="rounded-full bg-destructive/30 p-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-destructive">{submissionMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setScannedData(null);
                    setSubmissionStatus("idle");
                    setSubmissionMessage("");
                  }}
                  className="mt-3 rounded-lg bg-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/40 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

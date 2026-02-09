"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Eye, EyeOff, Lock, User, ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Simulate login validation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Demo: accept any non-empty credentials
    if (formData.employeeId && formData.password) {
      setIsLoading(false);
      router.push("/");
    } else {
      setError("ID Karyawan atau Password salah");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-success/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-success/3 rounded-full blur-3xl translate-y-1/2" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-success/10 border border-success/20 mb-5 shadow-lg shadow-success/5">
            <Fingerprint className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Absensi Karyawan
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Masuk untuk melanjutkan
          </p>
        </div>

        {/* Login form */}
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Employee ID Field */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-medium text-foreground">
                ID Karyawan
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Masukkan ID karyawan"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  className="pl-12 h-14 text-base rounded-xl bg-card border-border focus:border-success/50 focus:ring-success/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-12 pr-12 h-14 text-base rounded-xl bg-card border-border focus:border-success/50 focus:ring-success/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-success hover:bg-success/90 text-success-foreground font-semibold text-base transition-all duration-200 shadow-lg shadow-success/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Masuk</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Help text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Hubungi HRD jika mengalami kendala login
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Smartphone className="w-4 h-4" />
          <span className="text-xs">Aplikasi Absensi Karyawan v1.0</span>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Clock,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  Settings,
  Building2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { icon: Bell, label: "Notifikasi", badge: "3" },
  { icon: Shield, label: "Keamanan Akun" },
  { icon: Settings, label: "Pengaturan" },
  { icon: HelpCircle, label: "Bantuan" },
];

export function ProfileTab() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Profile Header */}
      <Card className="border-0 bg-gradient-to-br from-success/20 via-card to-card">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Avatar className="h-24 w-24 ring-4 ring-success/30 ring-offset-4 ring-offset-background">
            <AvatarImage src="" alt="Employee" />
            <AvatarFallback className="bg-success/20 text-success text-2xl font-semibold">
              BA
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold text-foreground">Budi Andrianto</h2>
          <p className="text-sm text-muted-foreground">budi.andrianto@company.com</p>
          <Badge variant="outline" className="mt-3 border-success/30 bg-success/10 text-success">
            Karyawan Aktif
          </Badge>
        </CardContent>
      </Card>

      {/* Employee Details */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="border-b border-border/50 px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Informasi Karyawan</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <User className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                <p className="text-sm font-medium text-foreground">Budi Andrianto</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <Briefcase className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Jabatan</p>
                <p className="text-sm font-medium text-foreground">Software Engineer</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <Building2 className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Departemen</p>
                <p className="text-sm font-medium text-foreground">IT Department</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <Mail className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">budi.andrianto@company.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <Phone className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">No. Telepon</p>
                <p className="text-sm font-medium text-foreground">+62 812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <MapPin className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Alamat</p>
                <p className="text-sm font-medium text-foreground">Jakarta Selatan, DKI Jakarta</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Schedule */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="border-b border-border/50 px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Jadwal Kerja</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-success/15 p-2.5">
                <Clock className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Shift</p>
                <p className="text-sm font-medium text-foreground">Reguler (08:00 - 17:00)</p>
              </div>
              <Badge className="bg-success/20 text-success">Aktif</Badge>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="rounded-xl bg-accent p-2.5">
                <Calendar className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Hari Kerja</p>
                <p className="text-sm font-medium text-foreground">Senin - Jumat</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/50 ${
                index !== menuItems.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="rounded-xl bg-accent p-2.5">
                <item.icon className="h-4 w-4 text-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              {item.badge && (
                <Badge className="bg-destructive/20 text-destructive">{item.badge}</Badge>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full rounded-xl border-destructive/30 bg-destructive/10 py-6 text-destructive hover:bg-destructive/20 hover:text-destructive"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="mr-2 h-5 w-5" />
        {isLoggingOut ? "Keluar..." : "Keluar dari Akun"}
      </Button>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground">
        Attendance App v1.0.0
      </p>
    </div>
  );
}

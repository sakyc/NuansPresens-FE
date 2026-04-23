"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Loader2,
  User
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface Ticket {
  id: number;
  subject: string;
  deskripsi: string;
  status: string;
  prioritas: string;
  createdAt: string;
  karyawan?: {
    id: number;
    nama: string;
  };
}

const statusConfig: any = {
  Open: { label: "Dibuka", color: "bg-warning/20 text-warning", icon: AlertCircle },
  "In-Progress": { label: "Diproses", color: "bg-info/20 text-info", icon: Clock },
  Closed: { label: "Ditutup", color: "bg-success/20 text-success", icon: CheckCircle2 },
};

export function TicketList({ onBack, onSelectTicket }: any) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { data: session } = useSession();
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", deskripsi: "" });

  const isOperator = session?.user?.role === "operator";

  const getKatalog = async () => {
    const userID = session?.user?.id;
    if (!userID) return;
    
    try {
      // Operator fetches all tickets, karyawan fetches only their own
      const endpoint = isOperator 
        ? `https://jeramy-silty-stasia.ngrok-free.dev/api/tiket`
        : `https://jeramy-silty-stasia.ngrok-free.dev/api/tiket/${userID}`;
      
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          'ngrok-skip-browser-warning': 'true' 
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => { 
    getKatalog(); 
  }, [session, isOperator]);

  const handleCreateTicket = async () => {
    // Validasi sederhana sebelum kirim
    if (!newTicket.subject.trim() || !newTicket.deskripsi.trim()) {
      toast.error("Subjek dan deskripsi wajib diisi!");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/tiket`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          subject: newTicket.subject,
          deskripsi: newTicket.deskripsi,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // BERHASIL
        toast.success("Tiket berhasil dibuat!");
        setIsCreatingTicket(false); 
        setNewTicket({ subject: "", deskripsi: "" }); 
        
        // Langsung masukkan ke daftar agar tidak perlu refresh manual
        setTickets((prev) => [result, ...prev]);
      } else {
        // GAGAL DARI SERVER
        toast.error(result.message || "Gagal membuat tiket di server.");
      }
    } catch (error) {
      // GAGAL KONEKSI/JARINGAN
      console.error("Gagal membuat tiket:", error);
      toast.error("Koneksi gagal. Pastikan API ngrok aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      <div className="flex items-center justify-between gap-3">
        <button 
          type="button"
          onClick={onBack} 
          className="rounded-lg p-2 transition-colors hover:bg-accent/50"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="flex-1 text-lg font-bold text-foreground">Pusat Bantuan & Tiket</h2>
      </div>

      {/* Only show "Buat Tiket Baru" button for non-operators */}
      {!isOperator && (
        <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 rounded-xl bg-success/90 py-6 text-foreground hover:bg-success">
              <Plus className="h-5 w-5" /> Buat Tiket Baru
            </Button>
          </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buat Tiket Baru</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Field>
              <FieldLabel>Subjek / Judul</FieldLabel>
              <Input
                placeholder="Apa masalahnya?"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="rounded-xl"
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel>Deskripsi Lengkap</FieldLabel>
              <Textarea
                placeholder="Ceritakan detail kendala Anda..."
                value={newTicket.deskripsi}
                onChange={(e) => setNewTicket({ ...newTicket, deskripsi: e.target.value })}
                className="rounded-xl min-h-[100px]"
                disabled={isLoading}
              />
            </Field>
            <Button 
              onClick={handleCreateTicket} 
              disabled={isLoading || !newTicket.subject || !newTicket.deskripsi}
              className="gap-2 rounded-xl bg-success/90 py-5 hover:bg-success"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                </>
              ) : (
                "Buat Tiket Sekarang"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      )}

      <div className="flex flex-col gap-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => {
            const config = statusConfig[ticket.status] || statusConfig["Open"];
            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelectTicket(ticket)}
                className="flex w-full items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:bg-accent/30"
              >
                <div className="rounded-lg bg-accent p-2.5">
                  <MessageSquare className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-1 text-sm">{ticket.subject}</h3>
                    <Badge className={`${config.color} text-[9px] px-2 py-0 font-normal`}>{config.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{ticket.deskripsi}</p>
                  {/* Show karyawan name for operator view */}
                  {isOperator && ticket.karyawan && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-primary font-medium">
                      <User className="h-3 w-3" />
                      <span>{ticket.karyawan.nama}</span>
                    </div>
                  )}
                  <div className="mt-1.5 text-[10px] text-muted-foreground font-medium">
                    {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              </button>
            )
          })
        ) : (
          <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">Belum ada tiket bantuan</p>
              <p className="text-xs text-muted-foreground/70">Klik tombol di atas untuk membuat tiket.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

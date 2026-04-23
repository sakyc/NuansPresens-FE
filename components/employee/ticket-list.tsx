"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";

export type TicketStatus = "open" | "in-progress" | "closed";

export interface Ticket {
  id: string;
  title: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  messages: number;
  description?: string;
}

interface TicketListProps {
  onBack: () => void;
  onSelectTicket: (ticket: Ticket) => void;
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "Masalah Login",
    subject: "Tidak bisa login ke aplikasi",
    status: "open",
    createdAt: "2024-04-20",
    messages: 2,
    description: "Saya tidak bisa login ke aplikasi, selalu mendapat error",
  },
  {
    id: "TKT-002",
    title: "Reset Password",
    subject: "Permintaan reset password",
    status: "in-progress",
    createdAt: "2024-04-18",
    messages: 5,
    description: "Butuh bantuan untuk reset password akun saya",
  },
  {
    id: "TKT-003",
    title: "Laporan Absensi",
    subject: "Koreksi data absensi",
    status: "closed",
    createdAt: "2024-04-15",
    messages: 8,
    description: "Permintaan koreksi data absensi bulan Maret",
  },
];

const statusConfig = {
  open: {
    label: "Dibuka",
    color: "bg-warning/20 text-warning",
    icon: AlertCircle,
  },
  "in-progress": {
    label: "Diproses",
    color: "bg-info/20 text-info",
    icon: Clock,
  },
  closed: {
    label: "Ditutup",
    color: "bg-success/20 text-success",
    icon: CheckCircle2,
  },
};

export function TicketList({ onBack, onSelectTicket }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    subject: "",
    description: "",
  });

  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.subject) {
      const ticket: Ticket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
        title: newTicket.title,
        subject: newTicket.subject,
        description: newTicket.description,
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        messages: 0,
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({ title: "", subject: "", description: "" });
      setIsCreatingTicket(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
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

      {/* Create Ticket Button */}
      <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2 rounded-xl bg-success/90 py-6 text-foreground hover:bg-success">
            <Plus className="h-5 w-5" />
            Buat Tiket Baru
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Tiket Baru</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Judul Tiket</FieldLabel>
              <Input
                placeholder="Masukkan judul tiket"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="rounded-xl"
              />
            </Field>
            <Field>
              <FieldLabel>Subjek</FieldLabel>
              <Input
                placeholder="Masukkan subjek tiket"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="rounded-xl"
              />
            </Field>
            <Field>
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea
                placeholder="Deskripsikan masalah Anda"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="rounded-xl"
              />
            </Field>
            <Button
              onClick={handleCreateTicket}
              className="gap-2 rounded-xl bg-success/90 py-5 hover:bg-success"
            >
              <Plus className="h-5 w-5" />
              Buat Tiket
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket List */}
      <div className="flex flex-col gap-3">
        {tickets.map((ticket) => {
          const config = statusConfig[ticket.status];
          const StatusIcon = config.icon;

          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSelectTicket(ticket)}
              className="flex w-full items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:bg-accent/30"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-accent p-2.5">
                  <MessageSquare className="h-5 w-5 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                  <Badge className={`${config.color} text-xs`}>{config.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{ticket.subject}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{ticket.createdAt}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {ticket.messages} pesan
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Belum ada tiket</p>
            <p className="text-xs text-muted-foreground/75">
              Buat tiket baru untuk menghubungi tim dukungan kami
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

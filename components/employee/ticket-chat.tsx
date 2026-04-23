"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ticket } from "./ticket-list";

interface ChatMessage {
  id: string;
  sender: "employee" | "operator";
  content: string;
  timestamp: string;
}

const statusConfig: any = {
  Open: { label: "Dibuka", color: "bg-warning/20 text-warning", icon: AlertCircle },
  "In-Progress": { label: "Diproses", color: "bg-info/20 text-info", icon: Clock },
  Closed: { label: "Ditutup", color: "bg-success/20 text-success", icon: CheckCircle2 },
};

export function TicketChat({ ticket, onBack }: { ticket: Ticket; onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "employee", content: ticket.deskripsi, timestamp: "Tadi" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const config = statusConfig[ticket.status] || statusConfig["Open"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: "employee",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="rounded-lg p-2 transition-colors hover:bg-accent/50">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 text-left">
          <h2 className="font-semibold text-foreground">{ticket.subject}</h2>
          <p className="text-xs text-muted-foreground">ID: {ticket.id}</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex-1 pr-4">
            <p className="text-xs text-muted-foreground">Status Tiket</p>
            <p className="mt-1 font-semibold text-foreground line-clamp-1">{ticket.subject}</p>
          </div>
          <Badge className={config.color}>{config.label}</Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 min-h-[300px]">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "employee" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 ${m.sender === "employee" ? "bg-secondary text-foreground" : "border border-border/50 bg-muted text-foreground"}`}>
              <p className="text-sm">{m.content}</p>
              <p className="mt-2 text-[10px] opacity-60">{m.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {ticket.status !== "Closed" ? (
        <div className="flex gap-3">
          <button className="rounded-xl border border-border/50 bg-card p-3 hover:bg-accent/30">
            <Paperclip className="h-5 w-5 text-foreground" />
          </button>
          <Input
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="rounded-xl"
          />
          <Button onClick={handleSendMessage} className="bg-success/90 hover:bg-success rounded-xl">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Card className="border-border/50 bg-muted/30 py-3 text-center text-xs text-muted-foreground">
          Tiket ini telah ditutup
        </Card>
      )}
    </div>
  );
}
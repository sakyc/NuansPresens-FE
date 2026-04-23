"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ticket, TicketStatus } from "./ticket-list";

interface ChatMessage {
  id: string;
  sender: "employee" | "operator";
  content: string;
  timestamp: string;
  attachment?: string;
}

interface TicketChatProps {
  ticket: Ticket;
  onBack: () => void;
}

const mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "employee",
    content: "Saya tidak bisa login ke aplikasi, selalu mendapat error pada halaman login",
    timestamp: "2024-04-20 09:15",
  },
  {
    id: "msg-2",
    sender: "operator",
    content:
      "Terima kasih telah menghubungi kami. Kami akan membantu Anda mengatasi masalah ini. Bisakah Anda memberikan detail error yang Anda lihat?",
    timestamp: "2024-04-20 09:30",
  },
  {
    id: "msg-3",
    sender: "employee",
    content:
      "Error yang muncul adalah 'Invalid credentials' meskipun saya sudah memasukkan password dengan benar",
    timestamp: "2024-04-20 09:45",
  },
  {
    id: "msg-4",
    sender: "operator",
    content:
      "Coba lakukan reset password melalui halaman login terlebih dahulu. Jika masih bermasalah, hubungi tim IT kami.",
    timestamp: "2024-04-20 10:00",
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

export function TicketChat({ ticket, onBack }: TicketChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: `msg-${messages.length + 1}`,
        sender: "employee",
        content: newMessage,
        timestamp: new Date().toLocaleString("id-ID"),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate operator response
      setIsLoading(true);
      setTimeout(() => {
        const operatorMessage: ChatMessage = {
          id: `msg-${messages.length + 2}`,
          sender: "operator",
          content: "Terima kasih atas pesan Anda. Tim kami sedang memproses tiket Anda.",
          timestamp: new Date().toLocaleString("id-ID"),
        };
        setMessages((prev) => [...prev, operatorMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const config = statusConfig[ticket.status];
  const StatusIcon = config.icon;

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
        <div className="flex-1 text-left">
          <h2 className="font-semibold text-foreground">{ticket.title}</h2>
          <p className="text-xs text-muted-foreground">{ticket.id}</p>
        </div>
      </div>

      {/* Ticket Status Card */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs text-muted-foreground">Status Tiket</p>
            <p className="mt-1 font-semibold text-foreground">{ticket.subject}</p>
          </div>
          <Badge className={config.color}>{config.label}</Badge>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "employee" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded-xl px-4 py-3 ${
                message.sender === "employee"
                  ? "bg-secondary text-foreground"
                  : "border border-border/50 bg-muted text-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={`mt-2 text-xs ${
                  message.sender === "employee"
                    ? "text-foreground/60"
                    : "text-muted-foreground"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-border/50 bg-muted px-4 py-3">
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                <div
                  className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {ticket.status !== "closed" && (
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-shrink-0 rounded-xl border border-border/50 bg-card p-3 transition-colors hover:bg-accent/30"
          >
            <Paperclip className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <Input
              placeholder="Ketik pesan Anda..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="rounded-xl"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="flex-shrink-0 gap-2 rounded-xl bg-success/90 px-4 hover:bg-success disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      )}

      {ticket.status === "closed" && (
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="py-3 text-center">
            <p className="text-xs text-muted-foreground">Tiket ini telah ditutup</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

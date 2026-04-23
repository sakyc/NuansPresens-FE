"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip, Clock, CheckCircle2, AlertCircle, PlayCircle, Loader2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "./ticket-list";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ChatMessage {
  id: number;
  responder_id: number;
  pesan: string;
  createdAt: string;
  is_auto_reply?: boolean;
}

const statusConfig: any = {
  Open: { label: "Dibuka", color: "bg-warning/20 text-warning", icon: AlertCircle },
  "In-Progress": { label: "Diproses", color: "bg-info/20 text-info", icon: Clock },
  Closed: { label: "Ditutup", color: "bg-success/20 text-success", icon: CheckCircle2 },
};

export function TicketChat({ ticket, onBack }: { ticket: Ticket; onBack: () => void }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rating state for karyawan
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const config = statusConfig[currentStatus] || statusConfig["Open"];
  const isOperator = session?.user?.role === "operator";
  const isKaryawan = session?.user?.role === "karyawan";
  const currentUserId = parseInt(session?.user?.id || "0");

  // Fetch messages from API
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/tiket/${ticket.id}/respon`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.responses || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if ticket has been rated
  const checkRating = async () => {
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/tiket/${ticket.id}/rating`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      const data = await res.json();
      if (res.ok && data.rating) {
        setHasRated(true);
        setRating(data.rating.skor || 0);
        setFeedback(data.rating.feedback || "");
      }
    } catch (error) {
      // Rating not found, user can submit
    }
  };

  useEffect(() => {
    fetchMessages();
    if (currentStatus === "Closed" && isKaryawan) {
      checkRating();
    }
  }, [ticket.id, currentStatus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/tiket/${ticket.id}/respon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          responder_id: currentUserId,
          pesan: newMessage,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, result]);
        setNewMessage("");
      } else {
        toast.error(result.message || "Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Koneksi gagal. Pastikan API aktif.");
    } finally {
      setIsSending(false);
    }
  };

  // Update ticket status (for operator)
  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/tiket/${ticket.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (res.ok) {
        setCurrentStatus(newStatus);
        toast.success(`Status tiket diubah ke ${newStatus}`);
      } else {
        toast.error(result.message || "Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Koneksi gagal");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Submit rating (for karyawan)
  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }

    setIsSubmittingRating(true);
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/tiket/${ticket.id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          skor: rating,
          feedback: feedback,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setHasRated(true);
        toast.success("Terima kasih atas penilaian Anda!");
      } else {
        toast.error(result.message || "Gagal mengirim rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Koneksi gagal");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Determine if a message is from the current user
  const isOwnMessage = (msg: ChatMessage) => {
    return msg.responder_id === currentUserId;
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="rounded-lg p-2 transition-colors hover:bg-accent/50">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 text-left">
          <h2 className="font-semibold text-foreground">{ticket.subject}</h2>
          <p className="text-xs text-muted-foreground">ID: {ticket.id}</p>
        </div>
      </div>

      {/* Status Card with Operator Actions */}
      <Card className="border-border/50">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-xs text-muted-foreground">Status Tiket</p>
              <p className="mt-1 font-semibold text-foreground line-clamp-1">{ticket.subject}</p>
            </div>
            <Badge className={config.color}>{config.label}</Badge>
          </div>

          {/* Operator Status Actions */}
          {isOperator && currentStatus !== "Closed" && (
            <div className="flex gap-2 pt-2 border-t border-border/50">
              {currentStatus === "Open" && (
                <Button
                  onClick={() => handleUpdateStatus("In-Progress")}
                  disabled={isUpdatingStatus}
                  className="flex-1 gap-2 bg-info/90 hover:bg-info text-white rounded-lg"
                  size="sm"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  Proses
                </Button>
              )}
              {(currentStatus === "Open" || currentStatus === "In-Progress") && (
                <Button
                  onClick={() => handleUpdateStatus("Closed")}
                  disabled={isUpdatingStatus}
                  className="flex-1 gap-2 bg-success/90 hover:bg-success text-white rounded-lg"
                  size="sm"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Selesaikan
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Belum ada percakapan</p>
          </div>
        ) : (
          messages.map((m) => {
            const ownMsg = isOwnMessage(m);
            return (
              <div key={m.id} className={`flex ${ownMsg ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    ownMsg
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/50 bg-accent/50 text-foreground"
                  }`}
                >
                  <p className="text-sm">{m.pesan}</p>
                  <p className={`mt-2 text-[10px] ${ownMsg ? "opacity-70" : "opacity-60"}`}>
                    {new Date(m.createdAt).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Rating Section for Karyawan when ticket is Closed */}
      {currentStatus === "Closed" && isKaryawan && (
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            {hasRated ? (
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">Terima kasih atas penilaian Anda!</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${star <= rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                {feedback && (
                  <p className="mt-2 text-xs text-muted-foreground italic">&quot;{feedback}&quot;</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground text-center">
                  Bagaimana pengalaman Anda dengan layanan ini?
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Berikan feedback Anda (opsional)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="rounded-xl min-h-[80px] text-sm"
                  disabled={isSubmittingRating}
                />
                <Button
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating || rating === 0}
                  className="gap-2 bg-success/90 hover:bg-success rounded-xl"
                >
                  {isSubmittingRating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    "Kirim Penilaian"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Input or Closed Notice */}
      {currentStatus !== "Closed" ? (
        <div className="flex gap-3">
          <button className="rounded-xl border border-border/50 bg-card p-3 hover:bg-accent/30">
            <Paperclip className="h-5 w-5 text-foreground" />
          </button>
          <Input
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            className="rounded-xl"
            disabled={isSending}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isSending || !newMessage.trim()}
            className="bg-success/90 hover:bg-success rounded-xl"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      ) : (
        !isKaryawan && (
          <Card className="border-border/50 bg-muted/30 py-3 text-center text-xs text-muted-foreground">
            Tiket ini telah ditutup
          </Card>
        )
      )}
    </div>
  );
}

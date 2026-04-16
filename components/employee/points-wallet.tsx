'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Gift,
  Zap,
  Info,
  ArrowLeft,
  Crown,
  Medal,
  Ticket
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface PointsWalletProps {
  onBack: () => void;
}
interface Transaction {
  id: number;
  user_id: number;
  type_transaksi: 'REWARD' | 'PENALTY' | 'SPEND';
  jumlah_point: number;
  point_saat_ini: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

interface LeaderboardUser {
  id: number;
  nama: string;
  point_karyawan: number;
  rank: number;
  rank_badge: 'gold' | 'silver' | 'bronze' | 'default';
  isUser?: boolean;
}
interface ShopItem {
  id: number;
  item_nama: string;
  item_deskripsi: string;
  item_harga: number;
  icon: string;
  type_stock: 'PER_USER' | "GLOBAL";
  stok_limit: number;
  
}
interface InventoryItem {
  id_item: number;
  item_nama: string;
  diperoleh: string;
  expiresIn: number;
  status: 'AKTIF' | 'TELAH DIGUNAKAN' | 'EXPIRED';
  icon: string;
}



export function PointsWallet({ onBack }: PointsWalletProps) {
  const [selectedTab, setSelectedTab] = useState('history');
  const [history, setHistory] = useState<Transaction[]>([]); 
  const [ranking, setRanking] = useState<LeaderboardUser[]>([]);
  const [katalog, setKatalog] = useState<ShopItem[]>([]);
  const [Inventory, setInventory] = useState<InventoryItem[]>([]);
  const [points, setPoints] = useState<number>(0);
  const { data: session } = useSession();

  // Mencari index user yang login di dalam array ranking
const userRankIndex = ranking.findIndex((user) => user.isUser);
// Jika ketemu (index tidak -1), tambahkan 1. Jika tidak ada, kasih tanda '-'
const myRank = userRankIndex !== -1 ? userRankIndex + 1 : '-';

  const getRankIcon = (badge: string) => {
    switch (badge) {
      case 'gold':
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 'silver':
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 'bronze':
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  let getHistory = async () => {
    const userId = session?.user?.id;
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/get-riwayat-point?user_id=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', 
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
      setHistory(data.data);
      setPoints(data.point_saat_ini);
      }
    } catch (error) {
    console.error('Error fetching history:', error);
    }
  }
  let getKatalog = async () => {
    try {
      let res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/get-katalog`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      let data = await res.json();
      if (res.ok) {
        setKatalog(data.data);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  }
  let getToken = async () => {
    const userId = session?.user?.id;
    try {
      let res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/get-karyawan-token?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      let data = await res.json();
      if (res.ok) {
        setInventory(data.data);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  }

  let getRanking = async () => {
    try {
      const res = await fetch(`https://jeramy-silty-stasia.ngrok-free.dev/api/get-ranking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        // MAPPING DATA DI SINI
        const mappedRanking: LeaderboardUser[] = data.data.map((item: any, index: number) => {
          const rank = index + 1;
          let badge: 'gold' | 'silver' | 'bronze' | 'default' = 'default';
          
          if (rank === 1) badge = 'gold';
          else if (rank === 2) badge = 'silver';
          else if (rank === 3) badge = 'bronze';

          return {
            id: item.id,
            nama: item.nama,
            point_karyawan: item.point_karyawan,
            rank: rank, 
            rank_badge: badge, 
            isUser: item.id === Number(session?.user?.karyawan?.id), 
          };
        });

        setRanking(mappedRanking);
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
    }
  };
  useEffect(() => {
    if (session?.user?.id) {
      getHistory();
      getRanking();
      getKatalog();
      getToken();
    }
  }, [session?.user?.id]);
  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Back Button */}
      <div className="flex items-center gap-2 px-1 pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
      </div>

      {/* Wallet Header Card */}
      <Card className="border-0 bg-gradient-to-br from-amber-500/20 via-card to-card overflow-hidden relative">
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl -z-10" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            {/* Left: Points Display */}
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                Total Poin Anda
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-extrabold text-amber-400">
                  {points}
                </span>
                <span className="text-lg font-bold text-amber-500/80">PTS</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Right: Rank Display */}
            <div className="flex flex-col items-end gap-3">
              <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                  Peringkat Anda
                </p>
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-2xl font-extrabold text-foreground">
                    #{myRank}
                  </span>
                  <span className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> 2 ↑
                  </span>
                </div>
              </div>

              {/* How it works button */}
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 hover:bg-white/5">
                <Info className="h-3.5 w-3.5" />
                Cara Kerja
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card border border-border/50">
          <TabsTrigger value="history" className="text-xs sm:text-sm">
            Riwayat
          </TabsTrigger>
          <TabsTrigger value="ranking" className="text-xs sm:text-sm">
            Ranking
          </TabsTrigger>
          <TabsTrigger value="shop" className="text-xs sm:text-sm">
            Toko
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs sm:text-sm">
            Inventori
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: History */}
        <TabsContent value="history" className="mt-4 space-y-3">
          {history.map((transaction) => {
            const isPositive = transaction.type_transaksi === 'REWARD';
            const isNeutral = transaction.type_transaksi === 'SPEND';
            const amountColor = isPositive
              ? 'text-success'
              : isNeutral
                ? 'text-amber-500'
                : 'text-destructive';
            const amountSign = transaction.jumlah_point > 0 ? '+' : '';

            return (
              <Card key={transaction.id} className="border-border/50 bg-card/50">
                <CardContent className="p-4 flex items-center gap-3">
                  {/* Icon */}
                  <div className={`rounded-xl p-2.5 ${isPositive ? 'bg-success/15' : isNeutral ? 'bg-amber-500/15' : 'bg-destructive/15'}`}>
                    {isPositive ? (
                      <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-success' : ''}`} />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction.keterangan}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className={`text-right font-bold ${amountColor} text-sm`}>
                    {amountSign}
                    {transaction.jumlah_point}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Tab 2: Ranking */}
        <TabsContent value="ranking" className="mt-4 space-y-2">
          {ranking.map((user) => (
            <Card
              key={user.id}
              className={`border-border/50 ${user.isUser ? 'bg-gradient-to-r from-success/10 to-transparent border-success/30' : 'bg-card/50'}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/50 font-bold text-sm min-w-fit">
                  {user.rank <= 3 ? (
                    <div className="flex items-center">
                      {getRankIcon(user.rank_badge)}
                    </div>
                  ) : (
                    <span className="text-foreground">{user.rank}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.nama}
                    </p>
                    {user.isUser && (
                      <Badge className="bg-success/20 text-success text-[10px] ml-auto sm:ml-0">
                        Anda
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.point_karyawan} PTS
                  </p>
                </div>

                {/* Points Display */}
                {!user.isUser && (
                  <div className="text-right text-sm font-bold text-amber-500">
                    {user.point_karyawan}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 3: Shop */}
        <TabsContent value="shop" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {katalog.map((item) => (
              <Card key={item.id} className="border-border/50 bg-card/50 overflow-hidden hover:border-amber-500/30 transition-colors">
                <CardContent className="p-4 flex flex-col h-full">
                  {/* Icon */}
                  <div className="text-3xl mb-3">{item.icon}</div>

                  {/* Content */}
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 line-clamp-2">
                    {item.item_nama}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-3 flex-1 line-clamp-2">
                    {item.item_deskripsi}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-amber-500">
                      {item.item_harga} PTS
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] sm:text-xs border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50"
                    >
                      Beli
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Inventory */}
        <TabsContent value="inventory" className="mt-4 space-y-3">
          {Inventory.length > 0 ? (
            Inventory.map((item) => (
              <Card
                key={item.id_item}
                className={`border-border/50 ${item.status === 'EXPIRED' ? 'border-warning/30 bg-warning/5' : 'bg-card/50'}`}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl min-w-fit">{item.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.item_nama}
                      </h3>
                      {item.status === 'EXPIRED' && (
                        <Badge className="bg-warning/20 text-warning text-[10px] ml-auto sm:ml-0 shrink-0">
                          Kadaluarsa
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Diperoleh:{' '}
                      {new Date(item.diperoleh).toLocaleDateString('id-ID')}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.status === 'EXPIRED' ? 'bg-warning' : 'bg-success'}`}
                          style={{
                            width: `${Math.min(100, (item.expiresIn / 30) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {item.expiresIn} hari
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-success hover:bg-success/90 ml-auto sm:ml-0"
                  >
                    Gunakan
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-8 text-center">
                <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Belum ada item di inventori
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Belanja di toko untuk mendapatkan item
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface PointsWalletProps {
  onBack: () => void;
}

// Mock data
const transactionHistory = [
  { id: 1, title: 'Hadir Tepat Waktu', date: '2026-04-15', amount: 50, type: 'earn' },
  { id: 2, title: 'Terlambat > 15 menit', date: '2026-04-14', amount: -10, type: 'deduct' },
  { id: 3, title: 'Bonus Kinerja', date: '2026-04-13', amount: 100, type: 'earn' },
  { id: 4, title: 'Redeem: Late Tolerance Voucher', date: '2026-04-12', amount: -250, type: 'spend' },
  { id: 5, title: 'Hadir Tepat Waktu', date: '2026-04-11', amount: 50, type: 'earn' },
  { id: 6, title: 'Tidak Hadir', date: '2026-04-10', amount: -50, type: 'deduct' },
  { id: 7, title: 'Bonus Asisten', date: '2026-04-09', amount: 75, type: 'earn' },
  { id: 8, title: 'Hadir Tepat Waktu', date: '2026-04-08', amount: 50, type: 'earn' },
];

const leaderboard = [
  { id: 1, name: 'Ahmad Wijaya', points: 3250, rank: 1, rank_badge: 'gold' },
  { id: 2, name: 'Siti Nurhaliza', points: 3120, rank: 2, rank_badge: 'silver' },
  { id: 3, name: 'Budi Santoso', points: 3005, rank: 3, rank_badge: 'bronze' },
  { id: 4, name: 'Rina Kusuma', points: 2890, rank: 4, rank_badge: 'default' },
  { id: 5, name: 'Taufik Rahman', points: 2750, rank: 5, rank_badge: 'default' },
  { id: 6, name: 'Rifki Muhammad Fadhil', points: 1250, rank: 6, rank_badge: 'default', isUser: true },
  { id: 7, name: 'Dian Pratama', points: 1100, rank: 7, rank_badge: 'default' },
  { id: 8, name: 'Linda Wijaya', points: 980, rank: 8, rank_badge: 'default' },
  { id: 9, name: 'Reza Firmansyah', points: 850, rank: 9, rank_badge: 'default' },
  { id: 10, name: 'Maya Susanti', points: 720, rank: 10, rank_badge: 'default' },
];

const shopItems = [
  {
    id: 1,
    title: 'Late Tolerance Voucher',
    description: 'Dapat terlambat 15 menit tanpa penalti',
    price: 250,
    icon: '🎟️',
  },
  {
    id: 2,
    title: 'Early Leave Pass',
    description: 'Izin pulang 30 menit lebih awal',
    price: 300,
    icon: '🚪',
  },
  {
    id: 3,
    title: 'Flex Time Day',
    description: 'Jam masuk fleksibel selama sehari',
    price: 400,
    icon: '⏰',
  },
  {
    id: 4,
    title: 'Work from Home Pass',
    description: 'Hak untuk bekerja dari rumah selama sehari',
    price: 350,
    icon: '🏠',
  },
  {
    id: 5,
    title: 'Bonus Break Time',
    description: 'Tambahan istirahat 30 menit',
    price: 150,
    icon: '☕',
  },
  {
    id: 6,
    title: 'Priority Support Badge',
    description: 'Badge khusus di sistem (dekoratif)',
    price: 500,
    icon: '⭐',
  },
];

const inventoryItems = [
  {
    id: 1,
    title: 'Late Tolerance Voucher',
    acquired: '2026-04-12',
    expiresIn: 25,
    status: 'active',
    icon: '🎟️',
  },
  {
    id: 2,
    title: 'Early Leave Pass',
    acquired: '2026-03-20',
    expiresIn: 35,
    status: 'active',
    icon: '🚪',
  },
  {
    id: 3,
    title: 'Work from Home Pass',
    acquired: '2026-03-10',
    expiresIn: 1,
    status: 'expiring_soon',
    icon: '🏠',
  },
];

export function PointsWallet({ onBack }: PointsWalletProps) {
  const [selectedTab, setSelectedTab] = useState('history');

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
                  1.250
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
                    #6
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
          {transactionHistory.map((transaction) => {
            const isPositive = transaction.type === 'earn';
            const isNeutral = transaction.type === 'spend';
            const amountColor = isPositive
              ? 'text-success'
              : isNeutral
                ? 'text-amber-500'
                : 'text-destructive';
            const amountSign = transaction.amount > 0 ? '+' : '';

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
                      {transaction.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className={`text-right font-bold ${amountColor} text-sm`}>
                    {amountSign}
                    {transaction.amount}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Tab 2: Ranking */}
        <TabsContent value="ranking" className="mt-4 space-y-2">
          {leaderboard.map((user) => (
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
                      {user.name}
                    </p>
                    {user.isUser && (
                      <Badge className="bg-success/20 text-success text-[10px] ml-auto sm:ml-0">
                        Anda
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.points.toLocaleString('id-ID')} PTS
                  </p>
                </div>

                {/* Points Display */}
                {!user.isUser && (
                  <div className="text-right text-sm font-bold text-amber-500">
                    {user.points.toLocaleString('id-ID')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 3: Shop */}
        <TabsContent value="shop" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {shopItems.map((item) => (
              <Card key={item.id} className="border-border/50 bg-card/50 overflow-hidden hover:border-amber-500/30 transition-colors">
                <CardContent className="p-4 flex flex-col h-full">
                  {/* Icon */}
                  <div className="text-3xl mb-3">{item.icon}</div>

                  {/* Content */}
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-3 flex-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-amber-500">
                      {item.price} PTS
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
          {inventoryItems.length > 0 ? (
            inventoryItems.map((item) => (
              <Card
                key={item.id}
                className={`border-border/50 ${item.status === 'expiring_soon' ? 'border-warning/30 bg-warning/5' : 'bg-card/50'}`}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl min-w-fit">{item.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      {item.status === 'expiring_soon' && (
                        <Badge className="bg-warning/20 text-warning text-[10px] ml-auto sm:ml-0 shrink-0">
                          Kadaluarsa
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Diperoleh:{' '}
                      {new Date(item.acquired).toLocaleDateString('id-ID')}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.status === 'expiring_soon' ? 'bg-warning' : 'bg-success'}`}
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

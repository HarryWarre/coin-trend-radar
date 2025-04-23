
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import CoinTable from '@/components/CoinTable';
import TimeframeSelector from '@/components/TimeframeSelector';
import ExchangeSelector from '@/components/ExchangeSelector';
import { getTrendingCoins } from '@/services/api';
import { CoinData, TimeframeOption, ExchangeOption } from '@/types/api';

const Dashboard = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<TimeframeOption>('4h');
  const [exchange, setExchange] = useState<ExchangeOption>('kucoin');
  const [trendingCoins, setTrendingCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    fetchTrendingCoins();
  }, [timeframe, exchange, activeTab]);
  
  const fetchTrendingCoins = async () => {
    setLoading(true);
    try {
      let filterType: string | undefined;
      let rating: string | undefined;
      
      if (activeTab !== "all") {
        filterType = "rating";
        rating = activeTab;
      }
      
      const response = await getTrendingCoins(timeframe, exchange, filterType, rating);
      setTrendingCoins(response.data);
    } catch (error) {
      console.error('Failed to fetch trending coins:', error);
      toast({
        title: "Error",
        description: "Failed to load trending coins. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Crypto Market Scanner</h1>
          
          <div className="flex flex-wrap gap-4">
            <TimeframeSelector 
              value={timeframe}
              onChange={setTimeframe}
            />
            
            <ExchangeSelector 
              value={exchange}
              onChange={setExchange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Scanned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{loading ? "-" : trendingCoins.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Bullish Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-profit">
                {loading ? "-" : trendingCoins.filter(coin => coin.signal === 'BUY').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Bearish Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-loss">
                {loading ? "-" : trendingCoins.filter(coin => coin.signal === 'SELL').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Coins</TabsTrigger>
            <TabsTrigger value="1">Rating 1</TabsTrigger>
            <TabsTrigger value="2">Rating 2</TabsTrigger>
            <TabsTrigger value="3">Rating 3</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <CoinTable 
              coins={trendingCoins}
              isLoading={loading}
              title={activeTab === "all" ? "Trending Coins" : `Coins with Rating ${activeTab}`}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-4 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Coin Trend Radar &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

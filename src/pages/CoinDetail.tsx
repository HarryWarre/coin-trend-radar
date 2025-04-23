
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import TimeframeSelector from '@/components/TimeframeSelector';
import ExchangeSelector from '@/components/ExchangeSelector';
import { getCoinDetails } from '@/services/api';
import { CoinDetailData, TimeframeOption, ExchangeOption } from '@/types/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart4,
  Activity
} from 'lucide-react';

const CoinDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [timeframe, setTimeframe] = useState<TimeframeOption>('4h');
  const [exchange, setExchange] = useState<ExchangeOption>('kucoin');
  const [coinData, setCoinData] = useState<CoinDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (symbol) {
      fetchCoinDetails();
    }
  }, [symbol, timeframe, exchange]);
  
  const fetchCoinDetails = async () => {
    if (!symbol) return;
    
    setLoading(true);
    try {
      const fullSymbol = `${exchange.toUpperCase()}:${symbol}`;
      const response = await getCoinDetails(fullSymbol, exchange, timeframe);
      
      setCoinData(response.data);
    } catch (error) {
      console.error('Failed to fetch coin details:', error);
      toast({
        title: "Error",
        description: `Failed to load data for ${symbol}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };
  
  const formatLargeNumber = (num?: number) => {
    if (!num) return "-";
    
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return formatNumber(num);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <h1 className="text-2xl font-bold">{symbol}</h1>
          
          {coinData?.signal && (
            <div className={`px-3 py-1 rounded text-sm font-medium ${
              coinData.signal === 'BUY' ? 'bg-profit/20 text-profit' : 
              coinData.signal === 'SELL' ? 'bg-loss/20 text-loss' : 
              'bg-muted text-muted-foreground'
            }`}>
              {coinData.signal}
            </div>
          )}
          
          <div className="ml-auto flex flex-wrap items-center gap-4">
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
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-48">
                <CardHeader>
                  <div className="shimmer h-6 w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="shimmer h-10 w-40 mb-4"></div>
                  <div className="shimmer h-4 w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !coinData ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Data Found</h2>
            <p className="text-muted-foreground">
              Could not load data for {symbol}. Please try again or check the symbol.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Current Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">${formatNumber(coinData.price)}</p>
                    <span className={coinData.change >= 0 ? 'change-positive' : 'change-negative'}>
                      {coinData.change > 0 ? '+' : ''}{coinData.change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>O: ${formatNumber(coinData.open)}</span>
                    <span>H: ${formatNumber(coinData.high)}</span>
                    <span>L: ${formatNumber(coinData.low)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Bollinger Bands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatNumber(coinData.bbwidth, 4)}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Upper: ${formatNumber(coinData.bb_upper)}</span>
                    <span>Mid: ${formatNumber(coinData.bb_middle)}</span>
                    <span>Lower: ${formatNumber(coinData.bb_lower)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm flex items-center gap-1">
                      <span>Rating:</span>
                      <span className="font-bold">{coinData.bb_rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Volume & Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatLargeNumber(coinData.volume)}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    24h Trading Volume
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5" />
                    Technical Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">RSI (14)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{formatNumber(coinData.rsi, 1)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          coinData.rsi > 70 ? 'bg-loss/20 text-loss' :
                          coinData.rsi < 30 ? 'bg-profit/20 text-profit' :
                          'bg-secondary text-secondary-foreground'
                        }`}>
                          {coinData.rsi > 70 ? 'Overbought' : 
                           coinData.rsi < 30 ? 'Oversold' : 'Neutral'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">MACD</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{formatNumber(coinData.macd, 1)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          coinData.macd > coinData.macd_signal ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                        }`}>
                          {coinData.macd > coinData.macd_signal ? 'Bullish' : 'Bearish'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">EMA 50</p>
                      <p className="font-medium">${formatNumber(coinData.ema_50)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">EMA 200</p>
                      <p className="font-medium">${formatNumber(coinData.ema_200)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ADX</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{formatNumber(coinData.adx, 1)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          coinData.adx > 25 ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {coinData.adx > 25 ? 'Strong' : 'Weak'} Trend
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Trend</p>
                      <div className="flex items-center gap-1">
                        {coinData.ema_50 > coinData.ema_200 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-profit" />
                            <p className="text-profit font-medium">Bullish</p>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-loss" />
                            <p className="text-loss font-medium">Bearish</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4 text-xs text-muted-foreground">
                  <p>Updated: {new Date().toLocaleString()}</p>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Signal Analysis
                  </CardTitle>
                  <CardDescription>
                    Based on {timeframe} timeframe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center my-4">
                    <div className={`
                      w-24 h-24 rounded-full flex items-center justify-center
                      ${coinData.signal === 'BUY' ? 'bg-profit/20 border-2 border-profit' : 
                        coinData.signal === 'SELL' ? 'bg-loss/20 border-2 border-loss' : 
                        'bg-muted border-2 border-muted-foreground'}
                    `}>
                      <span className={`text-2xl font-bold
                        ${coinData.signal === 'BUY' ? 'text-profit' : 
                          coinData.signal === 'SELL' ? 'text-loss' : 
                          'text-muted-foreground'}
                      `}>
                        {coinData.signal || 'NEUTRAL'}
                      </span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Signal Strength</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className={`h-2 flex-1 rounded-full ${
                              i <= coinData.bb_rating ? 
                                (coinData.signal === 'BUY' ? 'bg-profit' : 
                                coinData.signal === 'SELL' ? 'bg-loss' : 'bg-muted-foreground') : 
                                'bg-secondary'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        Rating: {coinData.bb_rating}/5
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Summary</p>
                      <p className="text-sm">
                        {coinData.signal === 'BUY' ? (
                          `${symbol} shows bullish potential on the ${timeframe} timeframe with a compressed Bollinger Band (${coinData.bbwidth.toFixed(4)}), suggesting a potential breakout. RSI at ${coinData.rsi.toFixed(1)} indicates room for upward movement.`
                        ) : coinData.signal === 'SELL' ? (
                          `${symbol} shows bearish signs on the ${timeframe} timeframe. With BBW at ${coinData.bbwidth.toFixed(4)} and RSI at ${coinData.rsi.toFixed(1)}, potential downside movement may occur.`
                        ) : (
                          `${symbol} is currently in a neutral zone on the ${timeframe} timeframe. With BBW at ${coinData.bbwidth.toFixed(4)} and RSI at ${coinData.rsi.toFixed(1)}, the market is indecisive.`
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4 flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Based on technical analysis
                  </p>
                  <p className="text-xs italic text-muted-foreground">
                    Not financial advice
                  </p>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </main>
      
      <footer className="py-4 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Coin Trend Radar &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default CoinDetail;

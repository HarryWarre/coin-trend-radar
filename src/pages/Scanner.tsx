
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import CoinTable from '@/components/CoinTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import TimeframeSelector from '@/components/TimeframeSelector';
import ExchangeSelector from '@/components/ExchangeSelector';
import { scanCoins } from '@/services/api';
import { TimeframeOption, ExchangeOption, CoinData } from '@/types/api';
import { Scan, RefreshCw } from 'lucide-react';

const Scanner = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<TimeframeOption>('4h');
  const [exchange, setExchange] = useState<ExchangeOption>('kucoin');
  const [bbwThreshold, setBbwThreshold] = useState("0.04");
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState<CoinData[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  
  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await scanCoins({
        hours: timeframe,
        bbw: bbwThreshold,
        exchange
      });
      
      setScanResults(response.data);
      setHasScanned(true);
      
      toast({
        title: "Scan Complete",
        description: `Found ${response.data.length} coins matching your criteria.`
      });
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan coins. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Coin Scanner" />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Bollinger Band Screener</h1>
          <p className="text-muted-foreground mt-1">
            Scan for cryptocurrencies with narrow Bollinger Band Width (BBW) to find potential breakouts.
          </p>
        </div>
        
        <Card className="p-6 mb-8">
          <form 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-2">Timeframe</label>
              <TimeframeSelector
                value={timeframe}
                onChange={setTimeframe}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Select the chart timeframe to analyze.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Exchange</label>
              <ExchangeSelector
                value={exchange}
                onChange={setExchange}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Choose the exchange to scan.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Bollinger Band Width (BBW) Threshold: {bbwThreshold}
              </label>
              <div className="flex items-center gap-4">
                <span className="text-xs">0.01</span>
                <Slider
                  value={[parseFloat(bbwThreshold)]}
                  min={0.01}
                  max={0.2}
                  step={0.01}
                  onValueChange={(value) => setBbwThreshold(value[0].toString())}
                  className="flex-1"
                />
                <span className="text-xs">0.2</span>
                <Input
                  type="number"
                  value={bbwThreshold}
                  onChange={(e) => setBbwThreshold(e.target.value)}
                  className="w-20"
                  step={0.01}
                  min={0.01}
                  max={0.2}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Lower values find more compressed bands, indicating potential breakouts.
              </p>
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    Run Scan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
        
        {hasScanned && (
          <CoinTable
            coins={scanResults}
            isLoading={loading}
            title={`Scan Results (${scanResults.length} coins)`}
          />
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

export default Scanner;

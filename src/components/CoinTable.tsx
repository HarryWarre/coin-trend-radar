
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoinData } from '@/types/api';

interface CoinTableProps {
  coins: CoinData[];
  isLoading: boolean;
  title: string;
}

const CoinTable: React.FC<CoinTableProps> = ({ coins, isLoading, title }) => {
  const navigate = useNavigate();
  
  const handleCoinClick = (symbol: string) => {
    navigate(`/coin/${symbol.split(':')[1]}`);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };

  const formatLargeNumber = (num: number) => {
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
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left p-4">Symbol</th>
              <th className="text-right p-4">
                <div className="flex items-center justify-end gap-1">
                  Price
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="text-right p-4">
                <div className="flex items-center justify-end gap-1">
                  Change
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="text-right p-4">
                <div className="flex items-center justify-end gap-1">
                  BBW
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="text-right p-4">
                <div className="flex items-center justify-end gap-1">
                  RSI
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="text-right p-4">
                <div className="flex items-center justify-end gap-1">
                  Volume
                  <ArrowUpDown size={14} />
                </div>
              </th>
              {coins.length > 0 && coins[0].rating !== undefined && (
                <th className="text-right p-4">
                  <div className="flex items-center justify-end gap-1">
                    Rating
                    <ArrowUpDown size={14} />
                  </div>
                </th>
              )}
              {coins.length > 0 && coins[0].signal && (
                <th className="text-right p-4">
                  <div className="flex items-center justify-end gap-1">
                    Signal
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <tr key={index}>
                  <td className="p-4"><div className="shimmer h-6 w-24"></div></td>
                  <td className="p-4 text-right"><div className="shimmer h-6 w-20 ml-auto"></div></td>
                  <td className="p-4 text-right"><div className="shimmer h-6 w-16 ml-auto"></div></td>
                  <td className="p-4 text-right"><div className="shimmer h-6 w-16 ml-auto"></div></td>
                  <td className="p-4 text-right"><div className="shimmer h-6 w-12 ml-auto"></div></td>
                  <td className="p-4 text-right"><div className="shimmer h-6 w-20 ml-auto"></div></td>
                  {coins.length > 0 && coins[0].rating !== undefined && (
                    <td className="p-4 text-right"><div className="shimmer h-6 w-8 ml-auto"></div></td>
                  )}
                  {coins.length > 0 && coins[0].signal && (
                    <td className="p-4 text-right"><div className="shimmer h-6 w-16 ml-auto"></div></td>
                  )}
                </tr>
              ))
            ) : coins.length === 0 ? (
              <tr>
                <td 
                  colSpan={coins[0]?.rating !== undefined ? 7 : 6} 
                  className="text-center p-4 text-muted-foreground"
                >
                  No coins found
                </td>
              </tr>
            ) : (
              coins.map((coin) => (
                <tr 
                  key={coin.symbol} 
                  onClick={() => handleCoinClick(coin.symbol)}
                  className="cursor-pointer"
                >
                  <td className="p-4 font-medium">
                    {coin.symbol.split(':')[1]}
                  </td>
                  <td className="p-4 text-right">
                    ${formatNumber(coin.price)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className={coin.change >= 0 ? 'change-positive' : 'change-negative'}>
                        {coin.change > 0 ? '+' : ''}{coin.change.toFixed(2)}%
                      </span>
                      {coin.change > 0 ? (
                        <ChevronUp className="h-4 w-4 text-profit" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-loss" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {formatNumber(coin.bbw, 4)}
                  </td>
                  <td className="p-4 text-right">
                    {formatNumber(coin.rsi, 1)}
                  </td>
                  <td className="p-4 text-right">
                    {formatLargeNumber(coin.volume)}
                  </td>
                  {coin.rating !== undefined && (
                    <td className="p-4 text-right font-medium">
                      {coin.rating}
                    </td>
                  )}
                  {coin.signal && (
                    <td className={`p-4 text-right font-medium ${
                      coin.signal === 'BUY' ? 'text-profit' : 
                      coin.signal === 'SELL' ? 'text-loss' : 'text-muted-foreground'
                    }`}>
                      {coin.signal}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinTable;

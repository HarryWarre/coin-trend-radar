
// API Response Types
export interface CoinData {
  symbol: string;
  price: number;
  bbw: number;
  change: number;
  rsi: number;
  volume: number;
  rating?: number;
  signal?: string;
}

export interface ScanResponse {
  status: string;
  timeframe: string;
  exchange: string;
  data: CoinData[];
}

export interface TrendingResponse {
  status: string;
  timeframe: string;
  exchange: string;
  filter_type?: string;
  rating_filter?: string;
  data: CoinData[];
}

export interface SymbolsResponse {
  status: string;
  exchange: string;
  symbols: string[];
}

export interface CoinDetailData {
  symbol: string;
  timeframe: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  bb_rating: number;
  signal: string;
  bbwidth: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  rsi: number;
  ema_50: number;
  ema_200: number;
  macd: number;
  macd_signal: number;
  adx: number;
  oscillators: Record<string, any>;
  moving_averages: Record<string, any>;
}

export interface CoinDetailResponse {
  status: string;
  data: CoinDetailData;
}

export interface ErrorResponse {
  status: string;
  message: string;
}

// API Request Types
export interface ScanRequest {
  hours: string;
  bbw: string;
  exchange: string;
}

export type TimeframeOption = '5m' | '15m' | '1h' | '4h' | '1D';
export type ExchangeOption = 'kucoin' | 'binance';

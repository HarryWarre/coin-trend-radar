
import { 
  ScanRequest, 
  ScanResponse, 
  TrendingResponse, 
  SymbolsResponse, 
  CoinDetailResponse,
  TimeframeOption,
  ExchangeOption
} from '../types/api';

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL in production

// Handle API errors consistently
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An unknown error occurred');
  }
  return response.json() as Promise<T>;
};

export const scanCoins = async (params: ScanRequest): Promise<ScanResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    return handleResponse<ScanResponse>(response);
  } catch (error) {
    console.error('Error scanning coins:', error);
    throw error;
  }
};

export const getTrendingCoins = async (
  timeframe: TimeframeOption = '5m',
  exchange: ExchangeOption = 'kucoin',
  filterType?: string,
  rating?: string
): Promise<TrendingResponse> => {
  try {
    let url = `${API_BASE_URL}/api/trending?timeframe=${timeframe}&exchange=${exchange}`;
    
    if (filterType) {
      url += `&filter_type=${filterType}`;
    }
    
    if (rating) {
      url += `&rating=${rating}`;
    }
    
    const response = await fetch(url);
    return handleResponse<TrendingResponse>(response);
  } catch (error) {
    console.error('Error getting trending coins:', error);
    throw error;
  }
};

export const getAvailableSymbols = async (
  exchange: ExchangeOption = 'kucoin'
): Promise<SymbolsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/symbols?exchange=${exchange}`);
    return handleResponse<SymbolsResponse>(response);
  } catch (error) {
    console.error('Error getting available symbols:', error);
    throw error;
  }
};

export const getCoinDetails = async (
  symbol: string,
  exchange: ExchangeOption = 'kucoin',
  timeframe: TimeframeOption = '4h'
): Promise<CoinDetailResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/coin-details?symbol=${encodeURIComponent(symbol)}&exchange=${exchange}&timeframe=${timeframe}`
    );
    return handleResponse<CoinDetailResponse>(response);
  } catch (error) {
    console.error('Error getting coin details:', error);
    throw error;
  }
};

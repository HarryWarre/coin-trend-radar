
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExchangeOption } from '@/types/api';

interface ExchangeSelectorProps {
  value: ExchangeOption;
  onChange: (value: ExchangeOption) => void;
}

const ExchangeSelector: React.FC<ExchangeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Exchange:</span>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as ExchangeOption)}
      >
        <SelectTrigger className="w-[100px] h-8">
          <SelectValue placeholder="Exchange" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kucoin">KuCoin</SelectItem>
          <SelectItem value="binance">Binance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExchangeSelector;

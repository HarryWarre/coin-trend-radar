
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeframeOption } from '@/types/api';

interface TimeframeSelectorProps {
  value: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Timeframe:</span>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TimeframeOption)}
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5m">5m</SelectItem>
          <SelectItem value="15m">15m</SelectItem>
          <SelectItem value="1h">1h</SelectItem>
          <SelectItem value="4h">4h</SelectItem>
          <SelectItem value="1D">1D</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeframeSelector;

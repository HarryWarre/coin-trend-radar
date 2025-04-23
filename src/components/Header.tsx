
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Coin Trend Radar' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/coin/${searchQuery.trim().toUpperCase()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="border-b border-border py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="flex-1 max-w-md mx-4"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search symbol (e.g. BTCUSDT)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary px-4 py-2 pl-10 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={() => navigate('/scanner')}
            variant="secondary"
          >
            Scanner
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate('/')}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

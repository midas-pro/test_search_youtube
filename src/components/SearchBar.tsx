
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Youtube } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search for trending videos..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-youtube-red focus:border-transparent"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-youtube-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">&#9696;</span>
          ) : (
            <Youtube className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;

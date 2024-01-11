import { useState } from 'react';

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <input
      className="rounded-full border border-gray-300 p-4 lg:w-1/3 md:w-2/3 w-full"
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search Pokémon name or ID"
      type="text"
      value={searchTerm}
    />
  );
};

export default SearchComponent;

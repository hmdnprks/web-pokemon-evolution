import { useState } from 'react';

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
  clearSearch: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch, clearSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  const handleClearClick = () => {
    setSearchTerm('');
    clearSearch();
  };

  return (
    <div className="relative lg:w-1/3 md:w-2/3 w-full">
      <input
        className="rounded-full border border-gray-300 p-4 w-full"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Pokémon name or ID"
        type="text"
        value={searchTerm}
      />
      {searchTerm && (
        <button
          className="absolute right-6 top-5 mt-0 mr-0 text-red-400"
          onClick={handleClearClick}
        >
          <img alt="close" className="w-5 h-5" src="/close.svg" />
        </button>
      )}
    </div>
  );
};

export default SearchComponent;

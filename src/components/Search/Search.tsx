interface SearchComponentProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search Pokémon"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="rounded-full border border-gray-300 p-4 lg:w-1/3 md:w-2/3 w-full"
    />
  );
};

export default SearchComponent;
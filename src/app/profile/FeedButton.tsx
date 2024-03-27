interface FeedButtonProps {
  selectedBerry: any;
  isEvolutionSelected: () => boolean;
  feedPokemon: () => void;
}

const FeedButton: React.FC<FeedButtonProps> = ({
  selectedBerry,
  isEvolutionSelected,
  feedPokemon,
}) => {
  return (
    <div className="w-full px-4 py-2 mt-8">
      <button
        className="w-full disabled:bg-gray-300 bg-green-800 text-white py-2 rounded-full"
        disabled={!selectedBerry || !isEvolutionSelected()}
        onClick={feedPokemon}
      >
        Feed Pokemon
      </button>
    </div>
  );
};

export default FeedButton;

const PokemonSkeleton = () => {
  return (
    <div
      className="animate-pulse p-2 border border-gray-200 rounded-lg overflow-hidden"
      data-testid="pokemon-loading-skeleton"
    >
      <div className="bg-gray-300 h-48 w-full" />
      <div className="h-6 bg-gray-300 rounded mt-2 w-3/4 mx-auto" />
    </div>
  );
};

export default PokemonSkeleton;

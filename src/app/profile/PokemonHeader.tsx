import BasicSkeleton from '@component/components/BasicSkeleton/BasicSkeleton';

interface PokemonHeaderProps {
  pokemonName: string;
  onDelete: () => void;
  isLoadingPokemon: boolean;
}

const PokemonHeader: React.FC<PokemonHeaderProps> = ({
  pokemonName,
  onDelete,
  isLoadingPokemon,
}) => (
  <header className="flex justify-center items-center px-4 gap-4">
    {isLoadingPokemon && (
      <div className="w-32">
        <BasicSkeleton />
      </div>
    )}
    {!isLoadingPokemon && (
      <>
        <h1 className="text-2xl font-bold capitalize">{pokemonName}</h1>
        <button
          className="text-xl bg-red-200 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onDelete}
        >
          &times;
        </button>
      </>
    )}
  </header>
);

export default PokemonHeader;

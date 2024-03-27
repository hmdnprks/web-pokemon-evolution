import BasicSkeleton from '@component/components/BasicSkeleton/BasicSkeleton';
import ChevronAnimation from '@component/components/ChevronAnimation/ChevronAnimation';
import InformationIcon from '@component/components/Icons/Information/InformationIcon';
import CountUp from 'react-countup';
import { PokemonStats } from './page';

interface PokemonStatsProps {
  pokemonStats: PokemonStats;
  openModal: () => void;
  isLoadingPokemon: boolean;
  feedHistory: any;
  showChevronUp: boolean;
  showChevronDown: boolean;
}

const PokemonStats: React.FC<PokemonStatsProps> = ({
  pokemonStats,
  openModal,
  isLoadingPokemon,
  feedHistory,
  showChevronUp,
  showChevronDown,
}) => {
  return (
    <div className="text-center mt-8 px-4 grid grid-cols-3 gap-3 justify-items-center">
      {Object.entries(pokemonStats).map(([key, value]) => (
        <div key={key}>
          <div
            className={`text-gray-500 text-sm ${
              key === 'Weight' && 'flex align-middle justify-center gap-1'
            }`}
          >
            {key}{' '}
            {key === 'Weight' && (
              <button onClick={openModal}>
                <InformationIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          {isLoadingPokemon && (
            <div className="w-12">
              <BasicSkeleton />
            </div>
          )}
          {!isLoadingPokemon && (
            <div className={`text-xl font-bold ${key === 'Weight' && 'flex justify-center'} gap-2`}>
              <CountUp
                duration={2}
                end={value}
                start={
                  key === 'Weight' && feedHistory.length > 0
                    ? value - feedHistory[feedHistory.length - 1].weight
                    : 0
                }
              />
              {key === 'Weight' && showChevronUp && <ChevronAnimation arrow="up" />}
              {key === 'Weight' && showChevronDown && <ChevronAnimation arrow="down" />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PokemonStats;

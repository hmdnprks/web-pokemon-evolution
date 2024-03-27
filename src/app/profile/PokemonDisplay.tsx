import { NextEvolution } from '@component/interfaces/pokemon';
import { useState } from 'react';
import CountUp from 'react-countup';
import { useSwipeable } from 'react-swipeable';

interface PokomenDisplayProps {
  isLoadingPokemon: boolean;
  pokemon: any;
  nextEvolutions: NextEvolution[];
  lockEvolution: boolean;
  setLockEvolution: any;
  pokemonStats: any;
  handleNextEvolutionChange: () => void;
  weightHistory: number[];
}

const PokomenDisplay: React.FC<PokomenDisplayProps> = ({
  isLoadingPokemon,
  pokemon,
  nextEvolutions,
  lockEvolution,
  setLockEvolution,
  pokemonStats,
  handleNextEvolutionChange,
  weightHistory,
}) => {
  const [fadeOutComplete, setFadeOutComplete] = useState(false);
  const [selectedEvolutionIndex, setSelectedEvolutionIndex] = useState<number>(0);

  const handleFadeOutAnimationEnd = () => {
    setFadeOutComplete(true);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!lockEvolution) {
        setSelectedEvolutionIndex((i) => Math.min(i + 1, nextEvolutions.length - 1));
      }
    },
    onSwipedRight: () => {
      if (!lockEvolution) {
        setSelectedEvolutionIndex((i) => Math.max(i - 1, 0));
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  const currentWeightDifference = Math.abs(
    nextEvolutions[selectedEvolutionIndex]?.stats?.weight ?? 0 - pokemonStats.Weight,
  );

  const startValue =
    weightHistory.length >= 2
      ? Math.abs(
        nextEvolutions[selectedEvolutionIndex]?.stats?.weight ??
            0 - weightHistory[weightHistory.length - 2],
      )
      : currentWeightDifference;

  return (
    <>
      {!isLoadingPokemon && (
        <div className="flex justify-center mt-4 space-x-2 items-center w-full p-4">
          {!fadeOutComplete && (
            <img
              alt={pokemon?.name}
              className="w-48 h-48 object-cover"
              onAnimationEnd={handleFadeOutAnimationEnd}
              src={pokemon?.imageUrl.large}
            />
          )}
          {nextEvolutions && nextEvolutions.length > 0 && (
            <>
              {!fadeOutComplete && (
                <div>
                  <img alt="arrow-right" className="w-16 h-16" src="/arrow.svg" />
                </div>
              )}
              <div
                className="flex w-full overflow-x-scroll hide-scroll-bar"
                {...(!lockEvolution ? handlers : {})}
              >
                <div className="flex transition-transform duration-300 ease-in-out min-w-full">
                  {nextEvolutions.map((evolution, index) => (
                    <div
                      className={`flex-shrink-0 flex-grow-0 ${
                        index === selectedEvolutionIndex ? 'active' : ''
                      }`}
                      key={evolution.id}
                      style={{ width: '100%', maxWidth: '100vw' }}
                    >
                      <div className="flex justify-center items-center">
                        {lockEvolution ? (
                          <button
                            className="w-6/12 bg-orange-300 text-white py-2 rounded-full text-sm flex justify-center items-center"
                            onClick={() => setLockEvolution(true)}
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            className="w-9/12 mt-2 bg-orange-500 text-white py-2 rounded-full text-sm flex justify-center items-center"
                            onClick={() => setLockEvolution(true)}
                          >
                            Pick Evolution
                          </button>
                        )}
                      </div>

                      <img
                        alt={evolution.name}
                        className="object-cover opacity-50 hover:opacity-100"
                        src={evolution.imageUrl.large}
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <p className="text-center text-gray-500 text-sm capitalize mt-2 font-semibold">
                        {evolution.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {!isLoadingPokemon && selectedEvolutionIndex !== null && nextEvolutions.length > 0 && (
        <div className="text-center mt-2">
          <p className="text-gray-500 text-sm">Next Evolution Weight</p>
          <div className="flex font-bold text-xl justify-center gap-1 mt-2">
            <p className="self-center">
              <span className=" text-orange-500">
                {nextEvolutions[selectedEvolutionIndex]?.stats?.weight ?? 0}
              </span>
              <span
                className={`${
                  nextEvolutions[selectedEvolutionIndex]?.stats?.weight ??
                  0 - pokemonStats.Weight >= 0
                    ? 'text-red-600'
                    : 'text-green-600 '
                } text-xs`}
              >
                &nbsp;(
                {nextEvolutions[selectedEvolutionIndex]?.stats?.weight ??
                0 - pokemonStats.Weight <= 0
                  ? '+'
                  : '-'}
                <CountUp duration={2} end={currentWeightDifference} start={startValue} />)
              </span>
            </p>
          </div>
          {(nextEvolutions[selectedEvolutionIndex]?.stats?.weight ?? 0) - pokemonStats.Weight <=
            0 && (
            <button
              className="px-3 py-2 rounded-full bg-orange-500 text-white mt-2 font-bold w-1/3"
              onClick={handleNextEvolutionChange}
            >
              Evolve
            </button>
          )}
        </div>
      )}
      {!isLoadingPokemon && nextEvolutions.length === 0 && (
        <div className="mx-auto p-4 py-2 bg-red-300 rounded-full text-white w-max flex justify-center items-center">
          <span>End of Evolution Chain</span>
        </div>
      )}
    </>
  );
};

export default PokomenDisplay;

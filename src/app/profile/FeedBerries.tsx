import BerryList from '@component/components/BerryList/BerryList';
import { firmnessMap } from '@component/constants/berry-weight';

interface FeedBerriesProps {
  selectedBerry: any;
  berriesData: any[];
  isLoading: boolean;
  lastElementRef: any;
  setSelectedBerry: (item: any) => void;
}

const FeedBerries: React.FC<FeedBerriesProps> = ({
  selectedBerry,
  berriesData,
  isLoading,
  lastElementRef,
  setSelectedBerry,
}) => {
  return (
    <div className="text-center mt-16 px-4">
      <div className="flex justify-center items-center gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-sm">Berries</p>
          <p className="text-lg font-bold capitalize">{selectedBerry?.name || '-'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Firmness</p>
          <p className="text-lg font-bold capitalize">
            {selectedBerry?.firmness.replaceAll('-', ' ') || '-'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Weight</p>
          <p className={`text-lg font-bold capitalize ${selectedBerry && 'text-orange-500'}`}>
            {selectedBerry
              ? `+${firmnessMap[(selectedBerry?.firmness as keyof typeof firmnessMap) || 'others']}`
              : '-'}
          </p>
        </div>
      </div>
      <BerryList
        berries={berriesData}
        isLoading={isLoading}
        lastBerryElementRef={lastElementRef}
        setSelectedBerry={(item) => setSelectedBerry(item)}
      />
    </div>
  );
};

export default FeedBerries;

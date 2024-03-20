import React, { useState } from 'react';
import { BerryItemResult } from '@component/interfaces/berry';

interface BerryListProps {
  berries: BerryItemResult[];
  setSelectedBerry: (berry: BerryItemResult) => void;
  isLoading: boolean;
}

const BerryList: React.FC<BerryListProps> = ({ berries, setSelectedBerry, isLoading }) => {
  const [selectedBerryId, setSelectedBerryId] = useState<string | null>(null);

  const handleSelectBerry = (berry: BerryItemResult) => {
    setSelectedBerryId(berry.id);
    setSelectedBerry(berry);
  };

  const BerrySkeleton = () => (
    <div
      className="flex overflow-x-auto gap-2 p-2 rounded-full border"
      data-testid="berry-list-loading-skeleton"
    >
      {Array.from(Array(10).keys()).map((i) => (
        <div
          className="flex-none mx-2 p-1 rounded-full animate-pulse bg-gray-300 w-10 h-10"
          data-testid="skeleton"
          key={`skeleton-${i}`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return <BerrySkeleton />;
  }

  if (berries?.length > 0) {
    return (
      <div className="flex overflow-x-auto p-2 rounded-full border">
        {berries.map((berry) => (
          <button
            className={`flex-none mx-2 p-1 rounded-lg ${
              selectedBerryId === berry.id ? 'bg-red-300' : ''
            }`}
            key={berry.id}
            onClick={() => handleSelectBerry(berry)}
          >
            <img alt={berry.name} className="w-10 h-10 object-cover" src={berry.imageUrl} />
          </button>
        ))}
      </div>
    );
  } else {
    return <div>No berries available</div>;
  }
};

export default BerryList;

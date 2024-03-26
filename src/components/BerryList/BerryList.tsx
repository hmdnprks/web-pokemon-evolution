import React, { useState } from 'react';
import { BerryItemResult } from '@component/interfaces/berry';
import Image from 'next/image';

interface BerryListProps {
  berries: BerryItemResult[];
  setSelectedBerry: (berry: BerryItemResult) => void;
  lastBerryElementRef: any;
  isLoading: boolean;
}

const BerryList: React.FC<BerryListProps> = ({
  berries,
  setSelectedBerry,
  isLoading,
  lastBerryElementRef,
}) => {
  const [selectedBerryId, setSelectedBerryId] = useState<string | null>(null);

  const handleSelectBerry = (berry: BerryItemResult) => {
    setSelectedBerryId(berry.id);
    setSelectedBerry(berry);
  };

  const BerrySkeleton = () => (
    <>
      {Array.from(Array(10).keys()).map((i) => (
        <div
          className="flex-none mx-2 p-1 rounded-full animate-pulse bg-gray-300 w-10 h-10"
          key={`skeleton-${i}`}
        />
      ))}
    </>
  );

  return (
    <>
      <div className="flex overflow-x-auto p-2 rounded-full border">
        {berries?.map((berry, index) => (
          <button
            className={`flex-none mx-2 p-1 rounded-lg ${
              selectedBerryId === berry.id ? 'bg-red-300' : ''
            }`}
            key={berry.id}
            onClick={() => handleSelectBerry(berry)}
            ref={berries.length === index + 1 ? lastBerryElementRef : null}
          >
            <Image
              alt={berry.name}
              className="w-10 h-10 object-cover"
              height={50}
              src={berry.imageUrl}
              width={50}
            />
          </button>
        ))}
        {isLoading && (
          <div data-testid="berry-skeleton">
            <BerrySkeleton />
          </div>
        )}
      </div>
    </>
  );
};

export default BerryList;

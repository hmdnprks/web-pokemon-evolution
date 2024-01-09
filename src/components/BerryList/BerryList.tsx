// BerryList.tsx
import React, { useState } from 'react';
import { BerryItemResult } from '@component/interfaces/berry';

interface BerryListProps {
  berries: BerryItemResult[];
  setSelectedBerry: (berry: BerryItemResult) => void;
}

const BerryList: React.FC<BerryListProps> = ({ berries, setSelectedBerry }) => {
  const [selectedBerryId, setSelectedBerryId] = useState<string | null>(null);

  const handleSelectBerry = (berry: BerryItemResult) => {
    setSelectedBerryId(berry.id);
    setSelectedBerry(berry);
  };

  if (berries?.length > 0) {
    return (
      <div className="flex overflow-x-auto p-2 rounded-full border">
        {berries.map((berry) => (
          <div className={`flex-none mx-2 p-1 ${selectedBerryId === berry.id ? 'ring-2 ring-green-500' : ''}`} key={berry.id} onClick={() => handleSelectBerry(berry)}>
            <img alt={berry.name} className="w-10 h-10 object-cover" src={berry.imageUrl} />
          </div>
        ))}
      </div>
    );
  }
};

export default BerryList;

import SimpleTable from '@component/components/SimpleTable/SimpleTable';
import Tabs from '@component/components/Tabs/Tabs';
import { firmnessMap, prohibitionBerryMap } from '@component/constants/berry-weight';

const ModalContent = () => {
  const tabs = [
    { id: 1, title: 'Feeding Rule', content: <FeedingRule /> },
    { id: 2, title: 'Feeding Prohibition', content: <FeedingProhibition /> },
  ];

  return <Tabs tabs={tabs} />;
};

const FeedingRule = () => {
  return (
    <div>
      <p className="text-sm text-gray-500">
        Pokemon weight growth will increase according to the following table
      </p>

      <SimpleTable
        data={Object.entries(firmnessMap).map(([key, value]) => [key, `+${value}`])}
        headers={['Firmness Berry', 'Weight Increase']}
      />
    </div>
  );
};

const FeedingProhibition = () => {
  return (
    <div>
      <p className="text-sm text-gray-500">
        Pokemon weight will decrease according to the following table
      </p>

      <SimpleTable
        data={prohibitionBerryMap.map((berry) => [berry.before, berry.after, `-${berry.weight}`])}
        headers={['Berry Before', 'Berry After', 'Weight Decrease']}
      />
    </div>
  );
};

export default ModalContent;

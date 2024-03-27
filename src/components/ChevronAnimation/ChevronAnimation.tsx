import Image from 'next/image';

type ChevronAnimationProps = {
  arrow: 'up' | 'down';
};

const ChevronAnimation = (props: ChevronAnimationProps) => {
  const { arrow } = props;
  return (
    <div className="flex justify-center items-center flex-col relative mr-2">
      <div className="chevron-up">
        <Image
          alt="chevron-up"
          className="w-6 h-4"
          height={20}
          role="img"
          src={`/chevron-${arrow}.svg`}
          width={30}
        />
      </div>
      <div className="chevron-up -mt-3 animation-delay-200">
        <Image
          alt="chevron-up"
          className="w-6 h-4"
          height={20}
          role="img"
          src={`/chevron-${arrow}.svg`}
          width={30}
        />
      </div>
      <div className="chevron-up -mt-3 animation-delay-400">
        <Image
          alt="chevron-up"
          className="w-6 h-4"
          height={20}
          role="img"
          src={`/chevron-${arrow}.svg`}
          width={30}
        />
      </div>
    </div>
  );
};

export default ChevronAnimation;

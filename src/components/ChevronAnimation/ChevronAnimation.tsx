type ChevronAnimationProps = {
  arrow: 'up' | 'down';
};

const ChevronAnimation = (props: ChevronAnimationProps) => {
  const { arrow } = props;
  return (
    <div className="flex justify-center items-center flex-col relative mr-2">
      <div className="chevron-up">
        <img className="w-6 h-4" role="img" src={`/chevron-${arrow}.svg`} />
      </div>
      <div className="chevron-up -mt-3 animation-delay-200">
        <img className="w-6 h-4" role="img" src={`/chevron-${arrow}.svg`} />
      </div>
      <div className="chevron-up -mt-3 animation-delay-400">
        <img className="w-6 h-4" role="img" src={`/chevron-${arrow}.svg`} />
      </div>
    </div>
  );
};

export default ChevronAnimation;

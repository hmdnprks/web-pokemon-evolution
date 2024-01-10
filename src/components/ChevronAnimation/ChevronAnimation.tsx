type ChevronAnimationProps = {
  arrow: 'up' | 'down';
};

const ChevronAnimation = (props: ChevronAnimationProps) => {
  const { arrow } = props;
  return (
    <div className="flex justify-center items-center flex-col relative mr-2">
      <div className="chevron-up text-purple-500"><img className="w-4 h-4" src={`/chevron-${arrow}.svg`} /></div>
      <div className="chevron-up text-purple-500 -mt-2 animation-delay-200"><img className="w-4 h-4" src={`/chevron-${arrow}.svg`} /></div>
      <div className="chevron-up text-purple-500 -mt-2 animation-delay-400"><img className="w-4 h-4" src={`/chevron-${arrow}.svg`} /></div>
    </div>
  );
};

export default ChevronAnimation;

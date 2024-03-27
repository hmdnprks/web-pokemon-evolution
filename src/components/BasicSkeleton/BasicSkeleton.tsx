const BasicSkeleton = () => {
  return (
    <div className="animate-pulse p-1 overflow-hidden" data-testid="basic-loading-skeleton">
      <div className="h-6 bg-gray-300 rounded" />
    </div>
  );
};

export default BasicSkeleton;

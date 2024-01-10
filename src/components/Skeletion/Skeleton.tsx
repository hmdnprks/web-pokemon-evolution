const Skeleton: React.FC = () => (
  <div className="animate-pulse p-2 border border-gray-200 rounded-lg overflow-hidden">
    <div className="bg-gray-300 h-24 w-full" /> {/* Placeholder for image */}
    <div className="h-6 bg-gray-300 rounded mt-2 w-3/4 mx-auto" /> {/* Placeholder for text */}
  </div>
);

export default Skeleton;

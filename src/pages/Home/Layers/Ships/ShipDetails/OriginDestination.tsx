import { useAppContext } from "../../../../../contexts/AppContext";

const OriginDestination = () => {
  const { selectedShip } = useAppContext();

  const properties = selectedShip.feature.properties || {};
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner flex items-center justify-center space-x-4 select-none text-gray-800 font-semibold text-sm">
      <div className="flex flex-col items-center max-w-[140px] truncate">
        <span className="text-xs text-gray-500 mb-1">Origin</span>
        <div title={properties?.origin || ""}>
          {properties?.origin || "Unknown Port"}
        </div>
      </div>

      <svg
        className="w-6 h-6 text-gray-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>

      <div className="flex flex-col items-center max-w-[140px] truncate">
        <span className="text-xs text-gray-500 mb-1">Destination</span>
        <div title={properties?.destination || ""}>
          {properties?.destination || "Unknown Port"}
        </div>
      </div>
    </div>
  );
};

export default OriginDestination;

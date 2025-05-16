
const NearestPort = ({ nearestPort }) => {
  return (
    <div className="p-3 border rounded-lg bg-gray-50">
      <p className="text-sm text-gray-600 mb-1 font-medium">
        Nearest Port (Live):
      </p>
      {nearestPort ? (
        <p className="text-sm">
          <span className="font-semibold">
            {nearestPort.properties?.name || "Unnamed Port"}
          </span>{" "}
          — {nearestPort.distanceInKm.toFixed(2)} km away
        </p>
      ) : (
        <p className="text-sm">Indexing...</p>
      )}
    </div>
  );
};

export default NearestPort;

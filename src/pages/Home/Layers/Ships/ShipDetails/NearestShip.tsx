const NearestShip = ({ nearestShip }) => {
  return (
    <div className="p-3 border rounded-lg bg-gray-50">
      <p className="text-sm text-gray-600 mb-1 font-medium">
        Nearest Ship (Live):
      </p>
      {nearestShip ? (
        <p className="text-sm">
          <span className="font-semibold">
            {nearestShip.feature.properties?.name || "Unnamed Vessel"}
          </span>{" "}
          — {nearestShip.distanceInKm.toFixed(2)} km away
        </p>
      ) : (
        <p className="text-sm">Calculating...</p>
      )}
    </div>
  );
};

export default NearestShip;

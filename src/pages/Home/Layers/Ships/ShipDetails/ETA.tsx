const ETA = ({
  etaHours,
  distanceTravelled,
}: {
  etaHours: number;
  distanceTravelled: number;
}) => {
  return (
    <div className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600 font-medium mb-1">ETA to port in</p>
        <p className="font-semibold">{etaHours} hrs</p>
      </div>

      {distanceTravelled && (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">
            Distance Travelled
          </p>
          <p className="font-semibold">{distanceTravelled} km</p>
        </div>
      )}
    </div>
  );
};

export default ETA;

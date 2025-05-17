import { useAppContext } from "@/contexts/AppContext";

const ShipDetails = () => {
  const { selectedShip } = useAppContext();

  const properties = selectedShip.feature.properties || {};

  return (
    <div className="text-sm text-gray-700 space-y-1">
      <p>
        <span className="font-medium">MMSI:</span> {properties.MMSI}
      </p>
      <p>
        <span className="font-medium">Type:</span> {properties.type}
      </p>
      <p>
        <span className="font-medium">Flag:</span> {properties.flag}
      </p>
      <p>
        <span className="font-medium">Age:</span> {properties.age} years
      </p>
      <p>
        <span className="font-medium">Speed:</span> {properties.speed} km/h
      </p>
    </div>
  );
};

export default ShipDetails;

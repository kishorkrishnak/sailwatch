import useAppContext from "../../contexts/AppContext/useAppContext";
import CameraModes from "./CameraModes";

interface ShipInfoProps {
  selectedFeature: any;
  handleFocus: () => void;
  selectedCameraMode: string;
  setSelectedCameraMode: (mode: string) => void;
}

const ShipInfo: React.FC<ShipInfoProps> = ({
  selectedFeature,
  handleFocus,
  selectedCameraMode,
  setSelectedCameraMode,
}) => {
  const properties = selectedFeature.properties || {};
  const { flyHome } = useAppContext();
  
  return (
    <div className="absolute bottom-5 right-5 bg-white/90 p-5 rounded-2xl w-[320px] shadow-2xl z-[1000] backdrop-blur-md border border-gray-200">
      <h1 className="text-xl font-bold text-[#2c3e50] mb-2">
        {properties.name || "Unnamed Vessel"}
      </h1>

      <button
        onClick={flyHome}
        className="cursor-pointer absolute top-2 right-4"
      >
        X
      </button>

      <div className="mb-4">
        <img
          src="https://via.placeholder.com/300x150?text=Ship+Image"
          alt={properties.name || "Ship image"}
          className="rounded-lg w-full object-cover h-[150px]"
        />
      </div>

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
          <span className="font-medium">Gross Tonnage:</span>{" "}
          {properties.grossTonnage} GT
        </p>
      </div>

      {properties.popupContent && (
        <p className="mt-3 text-sm italic text-gray-500">
          {properties.popupContent}
        </p>
      )}

      <div className="mt-4">
        <label
          htmlFor="cameraMode"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          Camera Mode:
        </label>

        <CameraModes
          handleFocus={handleFocus}
          selectedCameraMode={selectedCameraMode}
          setSelectedCameraMode={setSelectedCameraMode}
        />
      </div>

      <button
        onClick={handleFocus}
        className="w-full mt-4 bg-[#2c3e50] hover:bg-[#1a252f] text-white py-2 px-4 rounded-lg transition duration-200"
      >
        Refocus
      </button>
    </div>
  );
};

export default ShipInfo;

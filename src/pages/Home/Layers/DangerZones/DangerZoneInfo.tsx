import { IoClose } from "react-icons/io5";
import { useAppContext } from "../../../../contexts/AppContext";

const DangerZoneInfo = () => {
  const { selectedDangerZone, setSelectedDangerZone } = useAppContext();

  return (
    <div className="absolute bottom-5 right-5 bg-white/90 p-5 rounded-2xl w-[320px] shadow-2xl z-[1000] backdrop-blur-md border border-gray-200">
      <h1 className="text-xl font-bold text-[#2c3e50] mb-2">
        {selectedDangerZone.boundaryname || "Unnamed DangerZone"}
      </h1>
      <button
        onClick={() => setSelectedDangerZone(null)}
        className="cursor-pointer absolute top-2 right-3"
      >
        <IoClose size={20} />
      </button>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Type:</span>{" "}
          {selectedDangerZone.boundarytype}
        </p>
        <p>
          <span className="font-medium">Agency Of Use:</span>{" "}
          {selectedDangerZone.agencyofuse}
        </p>
        <p>
          <span className="font-medium">State:</span> {selectedDangerZone.state}
        </p>
        <p>
          <span className="font-medium">Effective Date:</span>{" "}
          {new Date(selectedDangerZone.effectivedate).toLocaleDateString()}
        </p>
      </div>

      {selectedDangerZone.popupContent && (
        <p className="mt-3 text-sm italic text-gray-500">
          {selectedDangerZone.popupContent}
        </p>
      )}
    </div>
  );
};

export default DangerZoneInfo;

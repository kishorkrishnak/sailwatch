import { IoClose } from "react-icons/io5";
import { useAppContext } from "../../../../contexts/AppContext";

const PortInfo = () => {
  const { selectedPort, setSelectedPort } = useAppContext();

  return (
    <div className="absolute bottom-5 right-5 bg-white/90 p-5 rounded-2xl w-[320px] shadow-2xl z-[10000] backdrop-blur-md border border-gray-200">
      <div className="mb-3">
        <h2 className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
          Port
        </h2>
        <h1 className="text-xl font-bold text-[#2c3e50] mb-2">
          {selectedPort.name || "Unnamed Port"}
        </h1>
      </div>
      <button
        onClick={() => setSelectedPort(null)}
        className="cursor-pointer absolute top-3 right-3"
      >
        <IoClose size={20} />
      </button>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Country:</span> {selectedPort.country}
        </p>
        <p>
          <span className="font-medium">City:</span> {selectedPort.city}
        </p>
        <p>
          <span className="font-medium">Province:</span> {selectedPort.province}
        </p>
        <p>
          <span className="font-medium">Port Code:</span> {selectedPort.code}
        </p>
      </div>
    </div>
  );
};

export default PortInfo;

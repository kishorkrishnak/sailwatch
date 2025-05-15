import { IoClose } from "react-icons/io5";
import { useAppContext } from "../../../../contexts/AppContext";
import anchor from "../../../../assets/images/anchor.svg";

const PortInfo = () => {
  const { selectedPort, setSelectedPort } = useAppContext();

  return (
    <div className="absolute bottom-5 right-5 bg-white/90 p-5 rounded-2xl w-[320px] shadow-2xl z-[10000] backdrop-blur-md border border-gray-200">
      <div className="mb-3">
           <li className="mb-1 flex items-center space-x-2">
          <img src={anchor} alt="Port" className="w-4 h-4" />
          <span>Port</span>
        </li>
        
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
          <span className="font-medium">Country:</span> {selectedPort.Country}
        </p>
        <p>
          <span className="font-medium">Region:</span> {selectedPort.D_Region}
        </p>
        <p>
          <span className="font-medium">Cabotage Region:</span> {selectedPort.Cabotage_Region}
        </p>
        
        <p>
          <span className="font-medium">UNLocode:</span> {selectedPort.UNLocode}
        </p>
        
      </div>
    </div>
  );
};

export default PortInfo;

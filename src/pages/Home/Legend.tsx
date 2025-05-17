import { useState } from "react";

import anchor from "@/assets/images/anchor.svg";
import ship from "@/assets/images/ship.svg";

const Legend = () => {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="cursor-pointer absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-sm font-medium z-[1000]"
      >
        Show Legend
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-[1000] w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Legend</h3>
        <button
          onClick={() => setVisible(false)}
          className="cursor-pointer text-xs text-blue-500 hover:underline"
        >
          Hide
        </button>
      </div>
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-center space-x-2">
          <img src={ship} alt="Ship" className="w-4 h-4" />
          <span>Ship</span>
        </li>
        <li className="flex items-center space-x-2">
          <img src={anchor} alt="Port" className="w-4 h-4" />
          <span>Port</span>
        </li>
        <li className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#FF000066] rounded-sm" />
          <span>Danger Zone</span>
        </li>
      </ul>
    </div>
  );
};

export default Legend;

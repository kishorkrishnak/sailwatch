import * as turf from "@turf/turf";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useCesium } from "resium";

import anchor from "@/assets/images/anchor.svg";
import { useAppContext } from "@/contexts/AppContext";
import getEntityPositionInDegrees from "@/utils/getEntityPositionInDegrees";

const PortInfo = () => {
  const { selectedPort, setSelectedPort, shipEntities } = useAppContext();
  const { viewer } = useCesium();
  const [searchRadius, setSearchRadius] = useState<number | string>(10);
  const [nearbyShips, setNearbyShips] = useState([]);
  const [calculated, setCalculated] = useState<boolean>(false);

  const findNearestShips = ({ distance = 5 }: { distance: number }) => {
    if (!viewer || !selectedPort?.geometry) return [];

    const currentTime = viewer.clock.currentTime;
    const { longitude, latitude } = selectedPort.geometry;
    const from = turf.point([longitude, latitude]);

    const nearbyShips = [];

    for (const ship of shipEntities) {
      const coords = getEntityPositionInDegrees(ship.cesiumEntity, currentTime);
      if (!coords) continue;

      const to = turf.point([coords.longitude, coords.latitude]);
      const dist = turf.distance(from, to, { units: "kilometers" });

      if (dist <= distance) {
        nearbyShips.push({
          ship,
          distanceInKm: dist,
        });
      }
    }

    return nearbyShips;
  };

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
          <span className="font-medium">Cabotage Region:</span>{" "}
          {selectedPort.Cabotage_Region}
        </p>

        <p>
          <span className="font-medium">UNLocode:</span> {selectedPort.UNLocode}
        </p>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Nearby Ships
          </h2>

          <div className="flex items-center space-x-2 mb-3">
            <label htmlFor="radiusInput" className="text-gray-700 font-medium">
              Radius (km):
            </label>
            <input
              id="radiusInput"
              type="number"
              min={0}
              max={1000}
              value={searchRadius}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  setSearchRadius("");
                  return;
                }

                if (/^\d*\.?\d*$/.test(val)) {
                  const num = Number(val);
                  if (num >= 0 && num <= 1000) {
                    setSearchRadius(num);
                  }
                }
              }}
              className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={() => {
                const ships = findNearestShips({ distance: searchRadius });
                setNearbyShips(ships);
                setCalculated(true);
              }}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Calculate
            </button>
          </div>

          {(calculated || nearbyShips.length > 0) && (
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white shadow-inner">
              {nearbyShips.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No ships found within specified radius.
                </p>
              ) : (
                nearbyShips.map(({ ship, distanceInKm }, index) => (
                  <div
                    key={ship.feature.properties.MMSI || index}
                    className="flex justify-between border-b border-gray-200 py-1 last:border-0"
                  >
                    <span className="font-medium text-gray-900">
                      {ship.feature.properties.name || "Unnamed Ship"}
                    </span>
                    <span className="text-gray-600">
                      {distanceInKm.toFixed(2)} km
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortInfo;

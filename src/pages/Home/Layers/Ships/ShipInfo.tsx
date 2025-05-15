import * as turf from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useCesium } from "resium";
import useAppContext from "../../../../contexts/AppContext/useAppContext";
import getEntityPositionInDegrees from "../../../../utils/getEntityPositionInDegrees";
import CameraModes from "./CameraModes";

const ShipInfo = () => {
  const {
    setSelectedShip,
    selectedShip,
    shipEntities,
    selectedShipEntity,
    selectedCameraMode,
    setSelectedCameraMode,
  } = useAppContext();

  const [nearestShip, setNearestShip] = useState(null);
  const rafRef = useRef();
  const { viewer } = useCesium();

  const properties = selectedShip.properties || {};

  const findNearestShip = () => {
    if (!viewer) return;
    const currentTime = viewer.clock.currentTime;
    const selectedCoords = getEntityPositionInDegrees(
      selectedShipEntity.cesiumEntity,
      currentTime
    );
    if (!selectedCoords) return null;

    const from = turf.point([
      selectedCoords.longitude,
      selectedCoords.latitude,
    ]);

    let nearest = null;
    let minDistance = Infinity;

    for (const ship of shipEntities) {
      if (
        ship.feature.properties.MMSI ===
        selectedShipEntity.feature.properties.MMSI
      )
        continue;

      const coords = getEntityPositionInDegrees(ship.cesiumEntity, currentTime);
      if (!coords) continue;

      const to = turf.point([coords.longitude, coords.latitude]);
      const distance = turf.distance(from, to, { units: "kilometers" });

      if (distance < minDistance) {
        minDistance = distance;
        nearest = ship;
      }
    }

    return nearest
      ? {
          ...nearest,
          distanceInKm: minDistance,
        }
      : null;
  };

  useEffect(() => {
    let lastUpdate = 0;
    const intervalMs = 3000;

    const update = (timestamp: number) => {
      if (timestamp - lastUpdate >= intervalMs) {
        const nearest = findNearestShip();
        setNearestShip(nearest);
        lastUpdate = timestamp;
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedShipEntity, shipEntities, viewer]);

  return (
    <div className="absolute bottom-5 right-5 bg-white/90 p-5 rounded-2xl w-[320px] shadow-2xl z-[1000] backdrop-blur-md border border-gray-200">
      <div className="mb-3">
        <h2 className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">
          Vessel
        </h2>
        <h1 className="text-xl font-bold text-[#2c3e50] mb-2">
          {properties.name || "Unnamed Vessel"}
        </h1>
      </div>
      <button
        onClick={() => setSelectedShip(null)}
        className="cursor-pointer absolute top-3 right-3"
      >
        <IoClose size={20} />
      </button>

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

      <CameraModes
        selectedCameraMode={selectedCameraMode}
        setSelectedCameraMode={setSelectedCameraMode}
      />

      <div className="mt-4 space-y-2">
        {nearestShip && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1 font-medium">
              Nearest Ship:
            </p>
            <p className="text-sm">
              <span className="font-semibold">
                {nearestShip.feature.properties?.name || "Unnamed Vessel"}
              </span>{" "}
              — {nearestShip.distanceInKm.toFixed(2)} km away
            </p>
          </div>
        )}

        <div className="p-3 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600 mb-1 font-medium">
            Nearest Port:
          </p>
          <p className="text-sm">[Coming Soon]</p>
        </div>
      </div>
    </div>
  );
};

export default ShipInfo;

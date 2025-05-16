import * as turf from "@turf/turf";
import { JulianDate } from "cesium";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useCesium } from "resium";
import ship from "../../../../assets/images/ship.svg";
import useAppContext from "../../../../contexts/AppContext/useAppContext";
import getEntityPositionInDegrees from "../../../../utils/getEntityPositionInDegrees";
import type { DangerZoneStatus } from "../../../../utils/types";
import DangerZoneDetails from "./DangerZoneDetails";

const ShipInfo = () => {
  const {
    setSelectedShip,
    selectedShip,
    shipEntities,
    loadPorts,
    loadDangerZones,
  } = useAppContext();

  const [nearestPort, setNearestPort] = useState<number | null>(null);
  const [distanceTravelled, setDistanceTravelled] = useState<number | null>(
    null
  );
  const [nearestShip, setNearestShip] = useState<string | null>(null);
  const [dangerZoneStatus, setDangerZoneStatus] =
    useState<DangerZoneStatus | null>({
      status: "Clear",
      criticalZone: {
        name: "",
        distance: null,
      },
    });

  const rafRef = useRef<number | null>(null);
  const { viewer } = useCesium();

  const properties = selectedShip.feature.properties || {};

  const findDistanceTravelled = (): number => {
    if (!viewer) return 0;

    const currentTime = viewer.clock.currentTime;
    const currentCoords = getEntityPositionInDegrees(
      selectedShip.cesiumEntity,
      currentTime
    );
    if (!currentCoords) return 0;

    const to = turf.point([currentCoords.longitude, currentCoords.latitude]);
    const startingCoordinates =
      selectedShip.feature.geometry.coordinates[0];
    const from = turf.point(startingCoordinates);

    const distance = turf.distance(from, to, { units: "kilometers" });
    return Number(distance.toFixed(2));
  };

  const findNearestPort = async () => {
    if (!viewer) return null;
    const currentTime = viewer.clock.currentTime;
    const selectedCoords = getEntityPositionInDegrees(
      selectedShip.cesiumEntity,
      currentTime
    );
    if (!selectedCoords) return null;

    const from = turf.point([
      selectedCoords.longitude,
      selectedCoords.latitude,
    ]);

    let nearest = null;
    let minDistance = Infinity;

    const ports = await loadPorts();

    const BBOX_PADDING_KM = 100;
    const bbox = turf.bbox(
      turf.buffer(from, BBOX_PADDING_KM, { units: "kilometers" })
    );

    const candidates = ports.features.filter((port: any) => {
      const [lon, lat] = port.geometry.coordinates;
      return (
        lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3]
      );
    });

    const portsToCheck = candidates.length > 0 ? candidates : ports.features;

    for (const port of portsToCheck) {
      const coords = port.geometry.coordinates;
      if (!coords) continue;

      const to = turf.point(coords);
      const distance = turf.distance(from, to, { units: "kilometers" });

      if (distance < minDistance) {
        minDistance = distance;
        nearest = port;
      }
    }

    return nearest
      ? {
        ...nearest,
        distanceInKm: minDistance,
      }
      : null;
  };

  const findNearestShip = () => {
    if (!viewer) return;
    const currentTime = viewer.clock.currentTime;
    const selectedCoords = getEntityPositionInDegrees(
      selectedShip.cesiumEntity,
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
        selectedShip.feature.properties.MMSI
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
  const findDangerZoneStatus = async (): Promise<DangerZoneStatus | null> => {
    if (!viewer) return null;

    const currentTime = viewer.clock.currentTime;
    const selectedCoords = getEntityPositionInDegrees(
      selectedShip.cesiumEntity,
      currentTime
    );

    if (!selectedCoords) return null;

    const shipPoint = turf.point([
      selectedCoords.longitude,
      selectedCoords.latitude,
    ]);

    const shipBuffer = turf.buffer(shipPoint, 10, { units: "kilometers" });
    const dangerZones = await loadDangerZones();

    let overallStatus = "Clear";
    let criticalZone = null;
    let minDistance = Infinity;

    for (const dangerZone of dangerZones.features) {
      if (!dangerZone.geometry) {
        continue;
      }

      const zone = turf.feature(dangerZone.geometry);
      const isInside = turf.booleanPointInPolygon(shipPoint, zone);
      const isNear = turf.booleanIntersects(shipBuffer, zone);

      if (isInside) {
        overallStatus = "Inside Danger Zone";
        criticalZone = {
          name: dangerZone.properties.boundaryname || "Unknown Zone",
          status: "inside",
        };
        break;
      } else if (isNear) {
        const centerOfDangerZone = turf.center(zone);
        const distance = turf.distance(shipPoint, centerOfDangerZone, {
          units: "kilometers",
        });

        if (distance < minDistance) {
          minDistance = distance;
          overallStatus = "Approaching Danger Zone";
          criticalZone = {
            name: dangerZone.properties.boundaryname || "Unknown Zone",
            status: "approaching",
            distance: distance.toFixed(2),
          };
        }
      }
    }

    return {
      status: overallStatus,
      criticalZone: criticalZone,
    };
  };

  useEffect(() => {
    let lastUpdate = 0;
    const intervalMs = 3000;

    const update = async (timestamp: number) => {
      if (timestamp - lastUpdate >= intervalMs) {
        const nearestPort = await findNearestPort();
        const distanceTravelled = findDistanceTravelled();
        const dangerZoneStatus = await findDangerZoneStatus();
        const nearestShip = findNearestShip();
        setNearestPort(nearestPort);
        setDistanceTravelled(distanceTravelled);
        setDangerZoneStatus(dangerZoneStatus);
        setNearestShip(nearestShip);
        lastUpdate = timestamp;
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [selectedShip, shipEntities, viewer]);

  const [etaHours, setEtaHours] = useState(0);

  useEffect(() => {
    if (!viewer || !selectedShip) return;

    const { endTime } = selectedShip;

    const updateEta = () => {
      const now = viewer.clock.currentTime;
      const remainingSeconds = JulianDate.secondsDifference(endTime, now);
      const remainingHours = Math.max(remainingSeconds / 3600, 0);
      setEtaHours(Number(remainingHours.toFixed(1)));
    };

    updateEta();

    const interval = setInterval(updateEta, 1000);
    return () => clearInterval(interval);
  }, [viewer, selectedShip, shipEntities]);

  return (
    <div className="custom-scrollbar absolute max-h-[95vh] overflow-auto bottom-5 right-5 bg-white/90 p-5 rounded-2xl w-[320px] shadow-2xl z-[10000] backdrop-blur-md border border-gray-200">
      <div className="mb-3">
        <li className="mb-1 flex items-center space-x-2">
          <img src={ship} alt="Ship" className="w-4 h-4" />
          <span>Ship</span>
        </li>
        <h1 className="text-xl font-bold text-[#2c3e50] mb-2">
          {properties.name || "Unnamed Vessel"}
        </h1>
      </div>
      <button
        onClick={() => {
          viewer.trackedEntity = undefined;
          setSelectedShip(null);
        }}
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
          <span className="font-medium">Speed:</span> {properties.speed} km/h
        </p>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner flex items-center justify-center space-x-4 select-none text-gray-800 font-semibold text-sm">
        <div className="flex flex-col items-center max-w-[140px] truncate">
          <span className="text-xs text-gray-500 mb-1">Origin</span>
          <div title={properties?.origin || ""}>
            {properties?.origin || "Unknown Port"}
          </div>
        </div>

        <svg
          className="w-6 h-6 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        <div className="flex flex-col items-center max-w-[140px] truncate">
          <span className="text-xs text-gray-500 mb-1">Destination</span>
          <div title={properties?.destination || ""}>
            {properties?.destination || "Unknown Port"}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">

        <div className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
          {etaHours > 0 ? <div>
            <p className="text-sm text-gray-600 font-medium mb-1">
              ETA to port in
            </p>
            <p className="font-semibold">{etaHours} hrs</p>
          </div> : <div>
            <p className="text-sm text-gray-600 font-medium mb-1">
              Arrived
            </p>

          </div>}
          {nearestShip && (
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Distance Travelled
              </p>
              <p className="font-semibold">{distanceTravelled} km</p>
            </div>
          )}
        </div>

        {nearestShip && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1 font-medium">
              Nearest Ship (Live):
            </p>
            <p className="text-sm">
              <span className="font-semibold">
                {nearestShip.feature.properties?.name || "Unnamed Vessel"}
              </span>{" "}
              — {nearestShip.distanceInKm.toFixed(2)} km away
            </p>
          </div>
        )}


        {nearestPort && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1 font-medium">
              Nearest Port (Live):
            </p>
            <p className="text-sm">
              <span className="font-semibold">
                {nearestPort.properties?.name || "Unnamed Port"}
              </span>{" "}
              — {nearestPort.distanceInKm.toFixed(2)} km away
            </p>
          </div>
        )}

        {etaHours > 0 && <DangerZoneDetails dangerZoneStatus={dangerZoneStatus} />}
      </div>
    </div>
  );
};

export default ShipInfo;

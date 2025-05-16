import * as turf from "@turf/turf";
import { JulianDate } from "cesium";
import RBush from "rbush";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useCesium } from "resium";
import ship from "../../../../../assets/images/ship.svg";
import useAppContext from "../../../../../contexts/AppContext/useAppContext";
import featureToRbushItem from "../../../../../utils/featureToRbushItem";
import getEntityPositionInDegrees from "../../../../../utils/getEntityPositionInDegrees";
import type {
  DangerZoneStatus,
  RbushFeatureItem,
} from "../../../../../utils/types";
import DangerZoneDetails from "./DangerZoneDetails";
import ETA from "./ETA";
import NearestPort from "./NearestPort";
import NearestShip from "./NearestShip";
import OriginDestination from "./OriginDestination";
import ShipDetails from "./ShipDetails";

const ShipInfo = () => {
  const {
    setSelectedShip,
    selectedShip,
    shipEntities,
    ports,
    loadPorts,
    dangerZones,
    loadDangerZones,
  } = useAppContext();

  const { viewer } = useCesium();

  const rafRef = useRef<number | null>(null);

  const [nearestPort, setNearestPort] = useState<number | null>(null);
  const [distanceTravelled, setDistanceTravelled] = useState<number>(0);
  const [nearestShip, setNearestShip] = useState<string | null>(null);

  const [dangerZoneStatus, setDangerZoneStatus] =
    useState<DangerZoneStatus | null>({
      status: "Clear",
      criticalZone: {
        name: "",
        distance: null,
      },
    });

  const portsIndexRef = useRef<RBush<RbushFeatureItem> | null>(null);

  useEffect(() => {
    const buildPortsIndex = async () => {
      const ports = await loadPorts();

      const tree = new RBush<RbushFeatureItem>();

      const items = ports.features.map(featureToRbushItem);

      tree.load(items);
      portsIndexRef.current = tree;
    };

    buildPortsIndex();
  }, [loadPorts]);

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
    const startingCoordinates = selectedShip.feature.geometry.coordinates[0];
    const from = turf.point(startingCoordinates);

    const distance = turf.distance(from, to, { units: "kilometers" });
    return Number(distance.toFixed(2));
  };

  const findNearestPort = async () => {
    if (!viewer || !portsIndexRef.current) return null;

    const currentTime = viewer.clock.currentTime;

    const selectedCoords = getEntityPositionInDegrees(
      selectedShip.cesiumEntity,
      currentTime
    );
    if (!selectedCoords) return null;

    const { longitude: lon, latitude: lat } = selectedCoords;

    const tree = portsIndexRef.current;

    let padding = 1;
    let candidates = [];

    while (candidates.length === 0 && padding <= 20) {
      candidates = tree.search({
        minX: lon - padding,
        minY: lat - padding,
        maxX: lon + padding,
        maxY: lat + padding,
      });
      padding *= 2;
    }

    if (candidates.length === 0) {
      candidates = ports.map((port: any) => ({
        minX: port.geometry.coordinates[0],
        minY: port.geometry.coordinates[1],
        maxX: port.geometry.coordinates[0],
        maxY: port.geometry.coordinates[1],
        port,
      }));
    }

    let nearest = null;
    let minDistance = Infinity;

    const from = turf.point([lon, lat]);

    for (const item of candidates) {
      const port = item.feature;
      if (!port.geometry) continue;
      const to = turf.point(port.geometry.coordinates);
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
      if (ship.feature.properties.MMSI === selectedShip.feature.properties.MMSI)
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

  const dangerZonesIndexRef = useRef<RBush<RbushFeatureItem> | null>(null);

  useEffect(() => {
    const buildDangerZonesIndex = async () => {
      const zones = await loadDangerZones();
      const tree = new RBush<RbushFeatureItem>();

      const items = zones.features.map(featureToRbushItem);
      tree.load(items);
      dangerZonesIndexRef.current = tree;
    };

    buildDangerZonesIndex();
  }, [loadDangerZones]);

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

    const tree = dangerZonesIndexRef.current;
    if (!tree) return null;

    const bufferBbox = turf.bbox(shipBuffer);

    const nearbyZones = tree.search({
      minX: bufferBbox[0],
      minY: bufferBbox[1],
      maxX: bufferBbox[2],
      maxY: bufferBbox[3],
    });

    let overallStatus = "Clear";
    let criticalZone = null;
    let minDistance = Infinity;

    for (const { feature: dangerZone } of nearbyZones) {
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

  const handleClose = () => {
    if (viewer) viewer.trackedEntity = undefined;
    setSelectedShip(null);
  };

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
        onClick={handleClose}
        className="cursor-pointer absolute top-3 right-3"
      >
        <IoClose size={20} />
      </button>

      <ShipDetails />
      <OriginDestination etaHours={etaHours} />

      {etaHours > 0 && (
        <div className="mt-4 space-y-2">
          <ETA distanceTravelled={distanceTravelled} etaHours={etaHours} />
          <NearestShip nearestShip={nearestShip} />
          <NearestPort nearestPort={nearestPort} />
          <DangerZoneDetails dangerZoneStatus={dangerZoneStatus} />
        </div>
      )}
    </div>
  );
};

export default ShipInfo;

import {
  Cartesian3,
  JulianDate,
  LagrangePolynomialApproximation,
  SampledPositionProperty,
  VelocityOrientationProperty
} from "cesium";
import type { Feature, GeoJsonObject } from "geojson";
import { useState, type ReactNode } from "react";
import { ships } from "../../utils/data";
import type { AppContextType } from "./AppContext";
import AppContext from "./AppContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedShip, setSelectedShip] = useState<Feature | null>(null);
  const [selectedCameraMode, setSelectedCameraMode] =
    useState<string>("TopDown");
  const [selectedPort, setSelectedPort] = useState<Feature | null>(null);
  const [selectedDangerZone, setSelectedDangerZone] = useState<Feature | null>(
    null
  );
  const [ports, setPorts] = useState<GeoJsonObject | null>(null);
  const [dangerZones, setDangerZones] = useState<GeoJsonObject | null>(null);

  const loadPorts = async (): Promise<GeoJsonObject | undefined> => {
    if (ports) return ports;

    try {
      const res = await fetch("/data/ports.geojson");
      const data: GeoJsonObject = await res.json();
      setPorts(data);
      return data;
    } catch (err) {
      return undefined;
    }
  };

  const loadDangerZones = async (): Promise<GeoJsonObject | undefined> => {
    if (dangerZones) return dangerZones;

    try {
      const res = await fetch("/data/danger_zones.geojson");
      const data: GeoJsonObject = await res.json();
      setDangerZones(data);
      return data;
    } catch (err) {
      return undefined;
    }
  };

  const [startTime] = useState(JulianDate.now());
  const [endTime] = useState(
    JulianDate.addHours(startTime, 12, new JulianDate())
  );

  const [shipEntities] = useState(() => {
    return ships.features
      .map((feature, index) => {
        if (feature.geometry.type === "LineString") {
          const coordinates = feature.geometry.coordinates;

          const sampledPosition = new SampledPositionProperty();

          const totalPoints = coordinates.length;
          coordinates.forEach(([lon, lat], i) => {
            const t = i / (totalPoints - 1);
            const time = JulianDate.addSeconds(
              startTime,
              t * JulianDate.secondsDifference(endTime, startTime),
              new JulianDate()
            );
            sampledPosition.addSample(
              time,
              Cartesian3.fromDegrees(lon, lat, 0)
            );
          });

          sampledPosition.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: LagrangePolynomialApproximation,
          });

          return {
            feature,
            position: sampledPosition,
            orientation: new VelocityOrientationProperty(sampledPosition),
            name: feature.properties?.name || `Ship ${index + 1}`,
          };
        }

        return null;
      })
      .filter(Boolean);
  });

  const selectedShipEntity = shipEntities.find(
    (e) => e.feature === selectedShip
  );
  const contextValue: AppContextType = {
    selectedShip,
    setSelectedShip,
    selectedCameraMode,
    setSelectedCameraMode,
    shipEntities,
    startTime,
    endTime,
    selectedPort,
    setSelectedPort,
    selectedDangerZone,
    setSelectedDangerZone,
    selectedShipEntity,
    ports,
    loadPorts,
    dangerZones,
    loadDangerZones,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

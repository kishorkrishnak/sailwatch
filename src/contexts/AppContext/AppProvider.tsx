import * as turf from "@turf/turf";
import {
  Cartesian3,
  JulianDate,
  LagrangePolynomialApproximation,
  SampledPositionProperty,
  VelocityOrientationProperty,
} from "cesium";
import type { Feature, GeoJsonObject } from "geojson";
import { useMemo, useState, type ReactNode } from "react";
import { ships } from "../../utils/data";
import { interpolateByDistance } from "../../utils/interpolateByDistance";
import AppContext, { type AppContextType } from "./AppContext";
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
      console.error(err);
      return undefined;
    }
  };

  const [startTime] = useState(JulianDate.now());

  const [shipEntities] = useState(() => {
    return ships.features
      .map((feature, index) => {
        if (feature.geometry.type === "LineString") {
          const coordinates = feature.geometry.coordinates;
          const line = turf.lineString(coordinates);
          const distance = turf.length(line, { units: "kilometers" });

          const speed = feature.properties?.speed ?? 40; // fallback to 40 if speed is missing
          const hoursNeeded = distance / speed;

          const endTime = JulianDate.addHours(
            startTime,
            hoursNeeded,
            new JulianDate()
          );

          const distances = [0];
          for (let i = 1; i < coordinates.length; i++) {
            const prev = turf.point(coordinates[i - 1]);
            const curr = turf.point(coordinates[i]);
            const segmentDist = turf.distance(prev, curr, {
              units: "kilometers",
            });
            distances.push(distances[i - 1] + segmentDist);
          }

          const sampledPosition = new SampledPositionProperty();

          // Sample positions based on normalized t [0..1], interpolated by distance
          for (let i = 0; i < coordinates.length; i++) {
            const t = i / (coordinates.length - 1);
            const [lon, lat] = interpolateByDistance(distances, coordinates, t);

            const time = JulianDate.addSeconds(
              startTime,
              t * JulianDate.secondsDifference(endTime, startTime),
              new JulianDate()
            );

            sampledPosition.addSample(
              time,
              Cartesian3.fromDegrees(lon, lat, 0)
            );
          }

          sampledPosition.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: LagrangePolynomialApproximation,
          });

          return {
            feature,
            position: sampledPosition,
            orientation: new VelocityOrientationProperty(sampledPosition),
            name: feature.properties?.name || `Ship ${index + 1}`,
            endTime,
          };
        }

        return null;
      })
      .filter(Boolean);
  });

  const contextValue: AppContextType = useMemo(
    () => ({
      selectedShip,
      setSelectedShip,
      selectedCameraMode,
      setSelectedCameraMode,
      shipEntities,
      startTime,
      selectedPort,
      setSelectedPort,
      selectedDangerZone,
      setSelectedDangerZone,
      ports,
      loadPorts,
      dangerZones,
      loadDangerZones,
    }),
    [
      selectedShip,
      selectedCameraMode,
      selectedPort,
      selectedDangerZone,
      ports,
      dangerZones,
      shipEntities,
      startTime,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

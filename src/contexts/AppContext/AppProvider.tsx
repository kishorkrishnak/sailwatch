import {
  Cartesian3,
  Viewer as CesiumViewer,
  JulianDate,
  LagrangePolynomialApproximation,
  SampledPositionProperty,
  VelocityOrientationProperty,
} from "cesium";
import type { Feature } from "geojson";
import { useRef, useState, type ReactNode } from "react";
import { shipPositions } from "../../utils/data";
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

  const viewerRef = useRef<CesiumViewer | null>(null);
  const [startTime] = useState(JulianDate.now());
  const [endTime] = useState(
    JulianDate.addDays(startTime, 2, new JulianDate())
  );

  const [shipEntities] = useState(() => {
    return shipPositions.features
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
            description: feature.properties?.popupContent,
          };
        }

        return null;
      })
      .filter(Boolean);
  });

  const flyHome = () => {
    viewerRef.current?.camera.flyHome(1);
  };

  const selectedShipEntity = shipEntities.find(
    (e) => e.feature === selectedShip
  );
  const contextValue: AppContextType = {
    selectedShip,
    setSelectedShip,
    selectedCameraMode,
    setSelectedCameraMode,
    viewerRef,
    shipEntities,
    startTime,
    endTime,
    flyHome,
    selectedPort,
    setSelectedPort,
    selectedDangerZone,
    setSelectedDangerZone,
    selectedShipEntity,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

import {
  Cartesian3,
  Viewer as CesiumViewer,
  HeadingPitchRange,
  JulianDate,
  LagrangePolynomialApproximation,
  SampledPositionProperty,
  VelocityOrientationProperty,
} from "cesium";
import { useRef, useState, type ReactNode } from "react";
import { cameraModeOffsets, shipPositions } from "../../utils/data";
import type { AppContextType } from "./AppContext";
import AppContext from "./AppContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedShip, setSelectedShip] = useState<any>(null);
  const [selectedCameraMode, setSelectedCameraMode] =
    useState<string>("TopDown");
  const [selectedPort, setSelectedPort] = useState<any>(null);
  const [selectedDangerZone, setSelectedDangerZone] = useState<any>(null);

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

  const handleFocus = () => {
    const entity = shipEntities.find(
      (e) => e.feature === selectedShip
    )?.cesiumEntity;

    if (!entity) return;

    if (selectedCameraMode === "Ship") {
      viewerRef.current.trackedEntity = entity;
      return;
    }

    viewerRef.current.trackedEntity = undefined;

    const currentTime = viewerRef.current.clock.currentTime;
    const entityPosition = entity.position.getValue(currentTime);
    if (!entityPosition) return;

    const scene = viewerRef.current.scene;
    const camera = scene.camera;

    const { heading, pitch, range } =
      cameraModeOffsets[selectedCameraMode] || {};

    const destination = Cartesian3.clone(entityPosition);
    camera.setView({
      destination: destination,
      orientation: {
        heading: heading,
        pitch: pitch,
        roll: 0,
      },
    });

    setTimeout(() => {
      const cameraOffset = new HeadingPitchRange(heading, pitch, range);

      viewerRef.current?.zoomTo(entity, cameraOffset);
    }, 100);
  };

  const flyHome = () => {

    viewerRef.current?.camera.flyHome(1);
  };

  const contextValue: AppContextType = {
    selectedShip,
    setSelectedShip,
    selectedCameraMode,
    setSelectedCameraMode,
    handleFocus,
    viewerRef,
    shipEntities,
    startTime,
    endTime,
    flyHome,
    selectedPort,
    setSelectedPort,
    selectedDangerZone,
    setSelectedDangerZone,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

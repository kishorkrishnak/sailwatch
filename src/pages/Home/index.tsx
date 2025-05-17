import {
  Viewer as CesiumViewer,
  ClockRange,
  ClockStep,
  createWorldTerrainAsync,
  TerrainProvider,
} from "cesium";
import { useEffect, useRef, useState } from "react";
import { Viewer } from "resium";

import useAppContext from "@/contexts/AppContext/useAppContext";

import DangerZones from "./Layers/DangerZones/DangerZones";
import Ports from "./Layers/Ports/Ports";
import Ships from "./Layers/Ships/Ships";
import Legend from "./Legend";

const Home = () => {
  const { startTime } = useAppContext();

  const viewerRef = useRef<CesiumViewer | null>(null);
  const hasSetClockRef = useRef<boolean>(false);

  const [terrainProvider, setTerrainProvider] = useState<
    TerrainProvider | Promise<TerrainProvider> | undefined
  >(undefined);

  const clockSettings = {
    startTime: startTime,
    currentTime: startTime,
    clockRange: ClockRange.LOOP_STOP,
    clockStep: ClockStep.SYSTEM_CLOCK_MULTIPLIER,
    multiplier: 10,
    shouldAnimate: true,
  };

  useEffect(() => {
    const loadTerrain = async () => {
      const terrain = await createWorldTerrainAsync();
      setTerrainProvider(terrain);
    };
    loadTerrain();
  }, []);

  return (
    <Viewer
      full
      ref={(ref) => {
        if (ref?.cesiumElement) {
          if (!hasSetClockRef.current) {
            viewerRef.current = ref.cesiumElement;
            for (const [key, value] of Object.entries(clockSettings)) {
              viewerRef.current.clock[key] = value;
            }
            hasSetClockRef.current = true;
          }
        }
      }}
      fullscreenButton={false}
      baseLayerPicker={false}
      infoBox={false}
      selectionIndicator={false}
      terrainProvider={terrainProvider}
      shouldAnimate={true}
      timeline={false}
    >
      <Ships />
      <DangerZones />
      <Ports />
      <Legend />
    </Viewer>
  );
};

export default Home;

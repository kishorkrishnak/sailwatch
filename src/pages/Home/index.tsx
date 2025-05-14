import {
  Clock,
  ClockRange,
  createWorldTerrainAsync,
  TerrainProvider,
} from "cesium";
import { useEffect, useState } from "react";
import { Viewer } from "resium";
import useAppContext from "../../contexts/AppContext/useAppContext";
import DangerZones from "./Layers/DangerZones";
import Ports from "./Layers/Ports";
import Ships from "./Layers/Ships";

const Home = () => {
  const { viewerRef, startTime, endTime } = useAppContext();

  const [cesiumClock] = useState<Clock>(
    new Clock({
      startTime: startTime,
      currentTime: startTime,
      stopTime: endTime,
      clockRange: ClockRange.LOOP_STOP,
      clockStep: 1,
      multiplier: 1,
      shouldAnimate: true,
    })
  );

  const [terrainProvider, setTerrainProvider] = useState<
    TerrainProvider | Promise<TerrainProvider> | undefined
  >(undefined);

  useEffect(() => {
    const loadTerrain = async () => {
      const terrain = await createWorldTerrainAsync();
      setTerrainProvider(terrain);
    };
    loadTerrain();
  }, []);

  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    if (viewerReady && viewerRef.current) {
      viewerRef.current.scene.globe.depthTestAgainstTerrain = true;
    }
  }, [viewerRef, viewerReady, startTime, endTime]);

  return (
    <>
      <Viewer
        full
        baseLayerPicker={false}
        ref={(resiumViewer) => {
          if (resiumViewer?.cesiumElement) {
            viewerRef.current = resiumViewer.cesiumElement;
            setViewerReady(true);
          }
        }}
        infoBox={false}
        selectionIndicator={false}
        clock={cesiumClock}
        terrainProvider={terrainProvider}
        shouldAnimate={true}
        timeline={false}
      >
        <Ships />
        <DangerZones />
        <Ports />
      </Viewer>
    </>
  );
};

export default Home;

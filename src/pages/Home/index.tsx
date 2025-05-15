import {
  Clock,
  ClockRange,
  createWorldTerrainAsync,
  TerrainProvider
} from "cesium";
import { useEffect, useState } from "react";
import { Viewer } from "resium";
import useAppContext from "../../contexts/AppContext/useAppContext";
import DangerZones from "./Layers/DangerZones/DangerZones";
import Ports from "./Layers/Ports/Ports";
import Ships from "./Layers/Ships/Ships";
import Legend from "./Legend";

const Home = () => {
  const { startTime } = useAppContext();

  const [terrainProvider, setTerrainProvider] = useState<
    TerrainProvider | Promise<TerrainProvider> | undefined
  >(undefined);

  const [cesiumClock] = useState<Clock>(
    new Clock({
      startTime: startTime,
      currentTime: startTime,
      clockRange: ClockRange.UNBOUNDED,
      clockStep: 1,
      multiplier: 1,
      shouldAnimate: true,
    })
  );

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
      fullscreenButton={false}
      // baseLayerPicker={false}
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
      <Legend />
    </Viewer>
  );
};

export default Home;

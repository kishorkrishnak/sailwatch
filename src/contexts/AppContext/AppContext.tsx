import { JulianDate } from "cesium";
import type { Feature, GeoJsonObject } from "geojson";
import { createContext } from "react";

export type AppContextType = {
  selectedShip: Feature;
  setSelectedShip: (value: Feature) => void;
  selectedDangerZone: Feature;
  setSelectedDangerZone: (value: Feature) => void;
  selectedPort: Feature;
  setSelectedPort: (value: Feature) => void;
  selectedCameraMode: string;
  setSelectedCameraMode: (value: string) => void;
  handleFocus: () => void;
  startTime: JulianDate;
  shipEntities: any[];
  endTime: JulianDate;
  ports: GeoJsonObject | null;
  loadPorts: () => Promise<GeoJsonObject | void>;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;

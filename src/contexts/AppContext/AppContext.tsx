import { Viewer as CesiumViewer, JulianDate } from "cesium";
import type { Feature } from "geojson";
import { createContext, type RefObject } from "react";

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
  flyHome: () => void;
  startTime: JulianDate;
  shipEntities: any[];
  endTime: JulianDate;
  viewerRef: RefObject<CesiumViewer | null>;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;

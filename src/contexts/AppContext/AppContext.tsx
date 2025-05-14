import { Viewer as CesiumViewer, JulianDate } from "cesium";
import { createContext, type RefObject } from "react";

export type AppContextType = {
  selectedShip: any;
  setSelectedShip: (value: any) => void;
  selectedDangerZone: any;
  setSelectedDangerZone: (value: any) => void;
  selectedPort: any;
  setSelectedPort: (value: any) => void;
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

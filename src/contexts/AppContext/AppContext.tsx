import { Viewer as CesiumViewer, JulianDate } from "cesium";
import { createContext, type RefObject } from "react";

export type AppContextType = {
  selectedFeature: any;
  setSelectedFeature: (value: any) => void;
  selectedCameraMode: string;
  setSelectedCameraMode: (value: string) => void;
  handleFocus: () => void;
  startTime: JulianDate;
  endTime: JulianDate;
  viewerRef: RefObject<CesiumViewer | null>;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;

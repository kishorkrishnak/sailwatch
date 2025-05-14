import { createContext } from "react";

export type AppContextType = {
  selectedFeature: any;
  setSelectedFeature: (value: any) => void;
  selectedCameraMode: string;
  setSelectedCameraMode: (value: string) => void;
  shouldFly: boolean;
  setShouldFly: (value: boolean) => void;
  handleFocus: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;

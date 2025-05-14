import { useState, type ReactNode } from "react";
import type { AppContextType } from "./AppContext";
import AppContext from "./AppContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedCameraMode, setSelectedCameraMode] =
    useState<string>("default");
  const [shouldFly, setShouldFly] = useState<boolean>(false);

  const handleFocus = () => {
    setShouldFly(true);
  };

  const contextValue: AppContextType = {
    selectedFeature,
    setSelectedFeature,
    selectedCameraMode,
    setSelectedCameraMode,
    shouldFly,
    setShouldFly,
    handleFocus,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

import { useContext } from "react";
import type { AppContextType } from "./AppContext";
import AppContext from "./AppContext";

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default useAppContext;

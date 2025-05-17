import { useMemo } from "react";

import useAppContext from "@/contexts/AppContext/useAppContext";

import CameraModes from "./CameraModes";
import ShipInfo from "./ShipDetails/ShipInfo";
import ShipEntity from "./ShipEntity";

const Ships = () => {
  const {
    selectedShip,
    shipEntities,
    startTime,
    setSelectedShip,
    setSelectedDangerZone,
    setSelectedPort,
  } = useAppContext();

  const handleShipSelect = useMemo(
    () => (shipEntity) => {
      setSelectedDangerZone(null);
      setSelectedPort(null);
      setSelectedShip(shipEntity);
    },
    [setSelectedDangerZone, setSelectedPort, setSelectedShip]
  );

  return (
    <>
      {shipEntities.map((shipEntity) => (
        <ShipEntity
          key={shipEntity.feature.properties.MMSI}
          shipEntity={shipEntity}
          isSelected={
            selectedShip?.feature.properties.MMSI ===
            shipEntity.feature.properties.MMSI
          }
          startTime={startTime}
          onSelectShip={() => handleShipSelect(shipEntity)}
        />
      ))}

      {selectedShip && (
        <>
          <ShipInfo />
          <CameraModes />
        </>
      )}
    </>
  );
};

export default Ships;

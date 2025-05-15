import {
  Cartesian3,
  Color,
  HeightReference,
  TimeInterval,
  TimeIntervalCollection,
} from "cesium";
import React from "react";
import { uid } from "react-uid";
import { Entity } from "resium";
import useAppContext from "../../../../contexts/AppContext/useAppContext";
import { shipModels } from "../../../../utils/data";
import CameraModes from "./CameraModes";
import ShipInfo from "./ShipInfo";

const Ships = () => {
  const {
    selectedShip,
    shipEntities,
    startTime,
    endTime,
    setSelectedShip,
    setSelectedDangerZone,
    setSelectedPort,
  } = useAppContext();

  return (
    <>
      {shipEntities.map((shipEntity, index) => (
        <React.Fragment key={uid(shipEntity)}>
          <Entity
            ref={(ref) => {
              if (ref?.cesiumElement) {
                shipEntities[index].cesiumEntity = ref.cesiumElement;
              }
            }}
            onDoubleClick={(event) => {
              event.preventDefault(); // if you want to stop Cesium’s default double-click zoom
              // your custom logic here
            }}
            availability={
              new TimeIntervalCollection([
                new TimeInterval({ start: startTime, stop: endTime }),
              ])
            }
            onClick={() => {
              setSelectedDangerZone(null);
              setSelectedPort(null);
              setSelectedShip(shipEntity.feature);
            }}
            name={shipEntity.name}
            position={shipEntity.position}
            model={{
              uri: shipModels[shipEntity.feature.properties.type],
              scale: 30,
              minimumPixelSize: 128,
              heightReference: HeightReference.CLAMP_TO_GROUND,
            }}
            orientation={shipEntity.orientation}
          />

          {selectedShip?.properties.MMSI ===
            shipEntity.feature.properties.MMSI && (
            <Entity
              polyline={{
                positions: Cartesian3.fromDegreesArray(
                  shipEntity.feature.geometry.coordinates.flat()
                ),
                material: Color.YELLOW,
                width: 2,
                clampToGround: true,
              }}
            />
          )}
        </React.Fragment>
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

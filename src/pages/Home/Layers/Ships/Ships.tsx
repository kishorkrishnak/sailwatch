import {
  Cartesian3,
  Color,
  HeightReference,
  TimeInterval,
  TimeIntervalCollection,
} from "cesium";
import { Entity } from "resium";
import useAppContext from "../../../../contexts/AppContext/useAppContext";
import { shipModels } from "../../../../utils/data";
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
        <>
          <Entity
            key={index}
            ref={(ref) => {
              if (ref?.cesiumElement) {
                shipEntities[index].cesiumEntity = ref.cesiumElement;
              }
            }}
            availability={
              new TimeIntervalCollection([
                new TimeInterval({
                  start: startTime,
                  stop: endTime,
                }),
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
        </>
      ))}

      {selectedShip && <ShipInfo />}
    </>
  );
};

export default Ships;

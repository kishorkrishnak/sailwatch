import { HeightReference, TimeInterval, TimeIntervalCollection } from "cesium";
import { Entity } from "resium";
import useAppContext from "../../../../contexts/AppContext/useAppContext";
import shipNavy from "../../../../assets/models/ship_navy.glb";
import ShipInfo from "./ShipInfo";

const Ships = () => {
  const { selectedShip, shipEntities, startTime, endTime, setSelectedShip } =
    useAppContext();
  return (
    <>
      {shipEntities.map((shipEntity, index) => (
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
            setSelectedShip(shipEntity.feature);
          }}
          name={shipEntity.name}
          position={shipEntity.position}
          model={{
            uri: shipNavy,
            scale: 30,
            minimumPixelSize: 128,
            heightReference: HeightReference.CLAMP_TO_TERRAIN,
          }}
          orientation={shipEntity.orientation}
          description={shipEntity.description}
        />
      ))}

      {selectedShip && <ShipInfo />}
    </>
  );
};

export default Ships;

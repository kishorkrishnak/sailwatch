import {
  DistanceDisplayCondition,
  HeightReference,
  VerticalOrigin,
} from "cesium";
import { GeoJsonDataSource } from "resium";
import { useAppContext } from "../../../contexts/AppContext";
import { useEntityClickDetection } from "../../../hooks";
import PortInfo from "./PortInfo";

const Ports = () => {
  const { selectedPort, setSelectedPort } = useAppContext();
  
  const handlePortClick = (entity) => {
    if (entity.properties) {
      const properties = entity.properties.getValue(new Date());
      setSelectedPort(properties);
    }
  };

  const { dataSourceRef } = useEntityClickDetection({
    onClick: handlePortClick,
  });

  return (
    <>
      <GeoJsonDataSource
        data={"/data/ports.geojson"}
        ref={dataSourceRef}
        onLoad={(dataSource) => {
          dataSourceRef.current = dataSource;

          dataSource.entities.values.forEach((entity) => {
            if (entity.position) {
              entity.billboard = {
                image: "/anchor.svg",
                scale: 1,
                width: 32,
                height: 32,
                distanceDisplayCondition: new DistanceDisplayCondition(
                  0,
                  5000000
                ),
                verticalOrigin: VerticalOrigin.BOTTOM,
                heightReference: HeightReference.CLAMP_TO_GROUND,
              };
            }
          });
        }}
      />

      {selectedPort && <PortInfo />}
    </>
  );
};

export default Ports;

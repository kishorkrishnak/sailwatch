import {
  Cartesian2,
  Color,
  DistanceDisplayCondition,
  Entity,
  HeightReference,
  LabelStyle,
  VerticalOrigin,
} from "cesium";
import { GeoJsonDataSource, useCesium } from "resium";
import anchor from "../../../../assets/images/anchor.svg";
import { useAppContext } from "../../../../contexts/AppContext";
import { useEntityClickDetection } from "../../../../hooks";
import getEntityPositionInDegrees from "../../../../utils/getEntityPositionInDegrees";
import PortInfo from "./PortInfo";

const Ports = () => {
  const {
    selectedPort,
    setSelectedPort,
    setSelectedDangerZone,
    setSelectedShip,
  } = useAppContext();

  const { viewer } = useCesium();

  const handlePortClick = (entity: Entity) => {
    if (!viewer) return;
    if (entity.properties && entity.position) {
      const currentTime = viewer.clock.currentTime;
      const properties = entity.properties.getValue(currentTime);

      const coords = getEntityPositionInDegrees(entity, currentTime);
      setSelectedDangerZone(null);
      setSelectedShip(null);

      setSelectedPort({
        ...properties,
        geometry: coords,
      });
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
                image: anchor,
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

              entity.label = {
                text: entity.name || "Port",
                font: "10pt Arial",
                fillColor: Color.WHITE,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
                style: LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: VerticalOrigin.TOP,
                pixelOffset: new Cartesian2(0, -48),
                distanceDisplayCondition: new DistanceDisplayCondition(
                  0,
                  5000000
                ),
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

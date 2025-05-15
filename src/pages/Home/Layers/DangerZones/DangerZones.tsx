import { Color, Entity } from "cesium";
import { GeoJsonDataSource } from "resium";
import { useAppContext } from "../../../../contexts/AppContext";
import { useEntityClickDetection } from "../../../../hooks";
import DangerZoneInfo from "./DangerZoneInfo";

const DangerZones = () => {
  const {
    selectedDangerZone,
    setSelectedDangerZone,
    setSelectedPort,
    setSelectedShip,
  } = useAppContext();

  const handleZoneClick = (entity: Entity) => {
    if (entity.properties) {
      const properties = entity.properties.getValue(new Date());
      setSelectedPort(null);
      setSelectedShip(null);
      setSelectedDangerZone(properties);
    }
  };

  const { dataSourceRef } = useEntityClickDetection({
    onClick: handleZoneClick,
  });

  return (
    <>
      <GeoJsonDataSource
        clampToGround={true}
        ref={dataSourceRef}
        onLoad={(dataSource) => {
          dataSourceRef.current = dataSource;
        }}
        data={`/data/danger_zones.geojson`}
        fill={Color.RED.withAlpha(0.4)}
        show
      />
      {selectedDangerZone && <DangerZoneInfo />}
    </>
  );
};

export default DangerZones;

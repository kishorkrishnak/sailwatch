import { Color } from "cesium";
import { GeoJsonDataSource } from "resium";
import { useAppContext } from "../../../contexts/AppContext";
import { useEntityClickDetection } from "../../../hooks";
import DangerZoneInfo from "./DangerZoneInfo";

const DangerZones = () => {
  const { selectedDangerZone, setSelectedDangerZone } = useAppContext();

  const handleZoneClick = (entity) => {
    if (entity.properties) {
      const properties = entity.properties.getValue(new Date());
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
        data={`/data/Danger_Zones_and_Restricted_Areas.geojson`}
        fill={Color.RED.withAlpha(0.4)}
        show
      />
      {selectedDangerZone && <DangerZoneInfo />}
    </>
  );
};

export default DangerZones;

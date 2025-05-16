import {
  Color,
  DistanceDisplayCondition,
  HeightReference,
  JulianDate,
  TimeInterval,
  TimeIntervalCollection,
} from "cesium";
import React, { useMemo } from "react";
import { Entity } from "resium";
import { shipModels } from "../../../../utils/data";

const ShipEntity = React.memo(
  ({
    shipEntity,
    isSelected,
    startTime,
    onSelectShip,
  }: {
    shipEntity: any;
    isSelected: boolean;
    startTime: JulianDate;
    onSelectShip: () => void;
  }) => {
    const availability = useMemo(
      () =>
        new TimeIntervalCollection([
          new TimeInterval({
            start: startTime,
            stop: shipEntity.endTime,
          }),
        ]),
      [startTime, shipEntity.endTime]
    );

    const pathConfig = useMemo(
      () =>
        isSelected
          ? {
              width: 2,
              material: Color.YELLOW,
              distanceDisplayCondition: new DistanceDisplayCondition(
                100000.0,
                Number.MAX_VALUE
              ),
            }
          : undefined,
      [isSelected]
    );

    const modelConfig = useMemo(
      () => ({
        uri: shipModels[shipEntity.feature.properties.type],
        minimumPixelSize: 60,
        scale: 30,
        heightReference: HeightReference.CLAMP_TO_GROUND,
      }),
      [shipEntity.feature.properties.type]
    );

    return (
      <Entity
        ref={(ref) => {
          if (ref?.cesiumElement) {
            shipEntity.cesiumEntity = ref.cesiumElement;
          }
        }}
        availability={availability}
        path={pathConfig}
        onClick={onSelectShip}
        name={shipEntity.name}
        position={shipEntity.position}
        model={modelConfig}
        orientation={shipEntity.orientation}
      />
    );
  }
);

export default ShipEntity;

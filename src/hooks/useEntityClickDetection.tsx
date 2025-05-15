import {
  Cartographic,
  Math as CesiumMath,
  Entity,
  GeoJsonDataSource,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from "cesium";
import { useEffect, useRef } from "react";
import { useCesium } from "resium";

export const useEntityClickDetection = ({
  onClick,
}: {
  onClick: (entity: Entity) => void;
}) => {
  const { viewer } = useCesium();
  const dataSourceRef = useRef<GeoJsonDataSource | null>(null);

  const hookIdRef = useRef(
    `entity-click-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    if (!viewer) return;

    const clickHandler = (event: ScreenSpaceEventHandler.PositionedEvent) => {
      const pickedObject = viewer.scene.pick(event.position);
      const pickedPosition = viewer.scene.pickPosition(event.position);

      const cartographic = Cartographic.fromCartesian(pickedPosition);

      const longitude = CesiumMath.toDegrees(cartographic.longitude);
      const latitude = CesiumMath.toDegrees(cartographic.latitude);

      console.log(`[${longitude.toFixed(2)}, ${latitude.toFixed(2)}]`);
      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id;
        const dataSource = dataSourceRef.current;

        if (dataSource && dataSource.entities.contains(entity)) {
          onClick(entity);
        }
      }
    };

    if (!viewer._entityClickHandlers) {
      viewer._entityClickHandlers = {};
    }

    viewer._entityClickHandlers[hookIdRef.current] = clickHandler;

    if (!viewer._entityClickHandlerActive) {
      viewer.screenSpaceEventHandler.setInputAction((event) => {
        Object.values(viewer._entityClickHandlers).forEach((handler: any) =>
          handler(event)
        );
      }, ScreenSpaceEventType.LEFT_CLICK);
      viewer._entityClickHandlerActive = true;
    }

    return () => {
      if (viewer && !viewer.isDestroyed() && viewer._entityClickHandlers) {
        delete viewer._entityClickHandlers[hookIdRef.current];

        if (Object.keys(viewer._entityClickHandlers).length === 0) {
          viewer.screenSpaceEventHandler.removeInputAction(
            ScreenSpaceEventType.LEFT_CLICK
          );
          viewer._entityClickHandlerActive = false;
        }
      }
    };
  }, [viewer, onClick]);

  return { dataSourceRef };
};

import { ScreenSpaceEventType } from "cesium";
import { useEffect, useRef } from "react";
import { useCesium } from "resium";

export const useEntityClickDetection = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  const { viewer } = useCesium();
  const dataSourceRef = useRef(null);

  useEffect(() => {
    if (!viewer) return;

    const clickHandler = (event) => {
      const pickedObject = viewer.scene.pick(event.position);

      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id;

        const dataSource = dataSourceRef.current;
        if (dataSource && dataSource.entities.contains(entity)) {
          onClick(entity, dataSource);
        }
      }
    };

    viewer.screenSpaceEventHandler.setInputAction(
      clickHandler,
      ScreenSpaceEventType.LEFT_CLICK
    );

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.screenSpaceEventHandler.removeInputAction(
          ScreenSpaceEventType.LEFT_CLICK
        );
      }
    };
  }, [viewer, onClick]);

  return { dataSourceRef };
};

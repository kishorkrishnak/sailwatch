import { Cartesian3 } from "cesium";
import { useEffect } from "react";
import { useCesium } from "resium";
import { useAppContext } from "../../contexts/AppContext";

export default function DynamicScale() {
  const { viewer } = useCesium();
  const { shipEntities } = useAppContext();
  useEffect(() => {
    const scene = viewer.scene;

    const updateScales = () => {
      const cameraPosition = viewer.camera.position;

      shipEntities.forEach((ship) => {
        if (!ship.cesiumEntity) return;

        const shipPos = ship.cesiumEntity.position?.getValue(
          viewer.clock.currentTime
        );
        if (!shipPos) return;

        const distance = Cartesian3.distance(cameraPosition, shipPos);
console.log(distance)
        // Example: Scale based on distance
        let newScale = 10;
        if (distance < 1000) newScale = 50;
        else if (distance < 5000) newScale = 30;
        else newScale = 10;

        ship.cesiumEntity.model.scale = newScale;
      });
    };

    scene.postRender.addEventListener(updateScales);

    return () => {
      scene.postRender.removeEventListener(updateScales);
    };
  }, [shipEntities, viewer]);

  return null;
}

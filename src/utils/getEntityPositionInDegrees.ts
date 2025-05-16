import {
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  Entity,
  JulianDate,
} from "cesium";

/**
 * Returns current latitude and longitude of an entity
 */
export default function getEntityPositionInDegrees(
  entity: Entity,
  currentTime: JulianDate
): { longitude: number; latitude: number } | null {
  const position: Cartesian3 | undefined =
    entity.position?.getValue(currentTime);
  if (!position) return null;

  const cartographic = Cartographic.fromCartesian(position);
  const longitude = CesiumMath.toDegrees(cartographic.longitude);
  const latitude = CesiumMath.toDegrees(cartographic.latitude);

  return { longitude, latitude };
}

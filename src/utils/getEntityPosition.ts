import { Cartesian3, Cartographic, Math as CesiumMath } from "cesium";

export default function getEntityPositionInDegrees(entity, currentTime): { longitude: number; latitude: number } | null {
  const position: Cartesian3 = entity.position?.getValue(currentTime);
  if (!position) return null;

  const cartographic = Cartographic.fromCartesian(position);
  const longitude = CesiumMath.toDegrees(cartographic.longitude);
  const latitude = CesiumMath.toDegrees(cartographic.latitude);

  return { longitude, latitude };
}

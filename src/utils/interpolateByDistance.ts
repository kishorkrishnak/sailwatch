import lerp from "./lerp";

/**
 * Interpolates a position along a path based on distance traveled
 */
const interpolateByDistance = (
  distances: number[],
  coordinates: [number, number][],
  t: number
): [number, number] => {
  const totalDistance = distances[distances.length - 1];
  const targetDistance = t * totalDistance;

  let segmentIndex = distances.findIndex((d) => d > targetDistance);
  if (segmentIndex === -1) {
    return coordinates[coordinates.length - 1];
  }
  if (segmentIndex === 0) segmentIndex = 1;

  const distBefore = distances[segmentIndex - 1];
  const distAfter = distances[segmentIndex];

  const segmentT = (targetDistance - distBefore) / (distAfter - distBefore);

  const [lon1, lat1] = coordinates[segmentIndex - 1];
  const [lon2, lat2] = coordinates[segmentIndex];

  const lon = lerp(lon1, lon2, segmentT);
  const lat = lerp(lat1, lat2, segmentT);

  return [lon, lat];
};

export default interpolateByDistance;

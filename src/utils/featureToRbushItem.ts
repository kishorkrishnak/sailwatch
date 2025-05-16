import bbox from "@turf/bbox";
import type { Feature } from "geojson";

const featureToRbushItem = (feature: Feature) => {
  const [minX, minY, maxX, maxY] = bbox(feature);
  return {
    minX,
    minY,
    maxX,
    maxY,
    feature,
  };
};

export default featureToRbushItem;

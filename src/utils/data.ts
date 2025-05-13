import { Math as CesiumMath } from "cesium";

export const cameraModeOffsets = {
  default: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(-45),
    range: 1000,
  },
  topDown: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(-90),
    range: 1000,
  },
    behind: {
    heading: CesiumMath.toRadians(90),
    pitch: CesiumMath.toRadians(-10),
    range: 400,
  },
  captain: {
    heading: CesiumMath.toRadians(90),
    pitch: CesiumMath.toRadians(-0),
    range: 0,
  },
};

export const shipPositions = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Ever Given",
        popupContent: "Ever Given is a famous container ship.",
      },
      geometry: {
        type: "Point",
        coordinates: [30.5852, 31.5242],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "MSC Meraviglia",
        popupContent: "MSC Meraviglia is a large cruise ship.",
      },
      geometry: {
        type: "Point",
        coordinates: [41.7025, 14.9732],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Maersk Alabama",
        popupContent: "Maersk Alabama operates in international waters.",
      },
      geometry: {
        type: "Point",
        coordinates: [80.7718, 5.5],
      },
    },
  ],
};
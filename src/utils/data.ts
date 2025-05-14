import { Math as CesiumMath } from "cesium";
import type { CameraOffset, ShipFeatureCollection } from "./types";

export const cameraModeOffsets: Record<string, CameraOffset> = {
  default: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(-45),
    height: 0,
    range: 1000,
  },
  topDown: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(-90),
    height: 0,
    range: 1000,
  },
  behind: {
    heading: CesiumMath.toRadians(90),
    pitch: CesiumMath.toRadians(-10),
    height: 0,
    range: 400,
  },
  captain: {
    heading: CesiumMath.toRadians(90),
    pitch: CesiumMath.toRadians(-5),
    height: 45,
    range: 6,
  },
};

export const shipPositions: ShipFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        MMSI: 235069875,
        name: "WIGHT RYDER I",
        type: "Passenger Ship",
        flag: "United Kingdom",
        age: 16,
        grossTonnage: 520,
      },
      geometry: {
        type: "Point",
        coordinates: [30.5852, 31.5242],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 211188220,
        name: "JANTJE VON DANGAST",
        type: "Passenger Ship",
        flag: "Germany",
        age: 48,
        grossTonnage: 214,
      },
      geometry: {
        type: "Point",
        coordinates: [41.7025, 14.9732],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 314216000,
        name: "WILSON CADIZ",
        type: "General Cargo Ship",
        flag: "Barbados",
        age: 25,
        grossTonnage: 2999,
      },
      geometry: {
        type: "Point",
        coordinates: [54.3724, 18.6643],
      },
    },
  ],
};

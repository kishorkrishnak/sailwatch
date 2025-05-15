import { Math as CesiumMath, HeadingPitchRange } from "cesium";
import type { FeatureCollection } from "geojson";
import generalCargo from "../assets/models/cargo.glb";
import warship from "../assets/models/warship.glb";

export const cameraModeOffsets: Record<string, HeadingPitchRange> = {
  TopDown: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(-90),
    range: 7500,
  },
  Side: {
    heading: CesiumMath.toRadians(-90),
    pitch: CesiumMath.toRadians(-15),
    range: 7500,
  },
  Ship: {
    heading: CesiumMath.toRadians(90),
    pitch: CesiumMath.toRadians(-10),
    range: 400,
  },
};

export const shipPositions: FeatureCollection = {
  type: "FeatureCollection",
  features: [
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
        type: "LineString",
        coordinates: [
          // Gibraltar Strait to Suez Canal route
          [-5.3536, 35.9894], // Gibraltar Strait
          [-2.934, 35.7633],
          [0.7422, 36.8945],
          [3.8965, 37.2341],
          [7.2656, 37.6123],
          [10.498, 37.8945],
          [13.7461, 37.5723],
          [16.6113, 36.8945],
          [19.8633, 35.6037],
          [22.5, 34.7465],
          [25.1367, 33.9988],
          [28.3887, 32.99],
          [31.2539, 31.9522], // Approaching Suez Canal
          [32.3242, 30.9783], // Suez Canal Entry
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 219023700,
        name: "MAERSK NEWCASTLE",
        type: "Container Ship",
        flag: "Denmark",
        age: 12,
        grossTonnage: 94724,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          // Transatlantic route from Rotterdam to New York
          [4.4033, 51.9036], // Port of Rotterdam
          [3.7207, 51.5142],
          [2.1094, 50.9566],
          [0.0878, 50.4297],
          [-2.0215, 49.895],
          [-4.0429, 49.153],
          [-6.6797, 48.6909],
          [-9.8438, 48.2246],
          [-12.9199, 47.4545],
          [-19.5117, 46.1954],
          [-26.3672, 44.9389],
          [-33.0469, 43.4529],
          [-41.3086, 41.6453],
          [-50.625, 40.3972],
          [-60.2051, 40.1299],
          [-68.8184, 40.3136],
          [-73.7695, 40.6462], // Approaching New York Harbor
          [-74.043, 40.7128], // New York
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 636012660,
        name: "EVER GIVEN",
        type: "Container Ship",
        flag: "Panama",
        age: 5,
        grossTonnage: 220940,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          // Singapore to Hong Kong route
          [103.8198, 1.3521], // Port of Singapore
          [104.458, 1.8633],
          [105.293, 2.4316],
          [106.5234, 3.249],
          [107.7539, 4.3898],
          [108.8965, 5.9701],
          [109.9512, 7.7106],
          [110.918, 9.449],
          [111.7969, 11.2583],
          [112.5879, 13.2399],
          [113.291, 15.3416],
          [113.9062, 17.4686],
          [114.1699, 19.6133],
          [114.1113, 21.5872], // Approaching Hong Kong
          [114.1694, 22.3193], // Hong Kong
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 369970000,
        name: "USS VIGILANT",
        type: "Destroyer",
        flag: "United States",
        age: 5,
        grossTonnage: 9200,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          // Norfolk, VA to Persian Gulf (fictional patrol route)
          [-76.3303, 36.9465], // Norfolk Naval Base
          [-70.0, 35.0],
          [-60.0, 33.0],
          [-50.0, 30.0],
          [-40.0, 25.0],
          [-30.0, 20.0],
          [-20.0, 17.0],
          [-10.0, 15.0],
          [0.0, 13.0],
          [10.0, 15.0],
          [20.0, 20.0],
          [30.0, 25.0],
          [40.0, 27.0],
          [50.0, 25.0],
          [56.25, 24.3], // Persian Gulf
        ],
      },
    },
  ],
};

export const shipModels = {
  "Container Ship": generalCargo,
  "General Cargo Ship": generalCargo,
  Destroyer: warship,
};

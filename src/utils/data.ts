import { Math as CesiumMath } from "cesium";
import type { CameraOffset, ShipFeatureCollection } from "./types";

export const cameraModeOffsets: Record<string, CameraOffset> = {
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

export interface ShipFeatureCollection {
  type: "FeatureCollection";
  features: ShipFeature[];
}

export interface ShipFeature {
  type: "Feature";
  properties: {
    MMSI: number;
    name: string;
    type: string;
    flag: string;
    age: number;
    grossTonnage: number;
  };
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export const shipPositions: ShipFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        image: "",

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
        image: "",
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
        image: "",

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
        image: "",

        MMSI: 538008957,
        name: "STELLAR BANNER",
        type: "Bulk Carrier",
        flag: "Marshall Islands",
        age: 9,
        grossTonnage: 149849,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          // Brazil to China route (around Cape of Good Hope)
          [-44.3823, -23.0047], // Port of Itaguaí, Brazil
          [-43.1689, -23.8523],
          [-41.0889, -24.7681],
          [-38.6572, -25.9209],
          [-35.8594, -27.2183],
          [-32.6953, -28.6315],
          [-28.6133, -30.1455],
          [-23.5547, -31.8029],
          [-18.3691, -33.2804],
          [-13.0957, -34.4566],
          [-7.7344, -35.1739],
          [-2.2852, -35.4606],
          [3.0762, -35.3173],
          [8.3496, -34.7416],
          [13.4473, -33.865],
          [18.3691, -32.6945],
          [23.0273, -31.2536],
          [27.5098, -29.6133],
          [31.8164, -27.7149],
          [36.0352, -25.5991],
          [40.1367, -23.3211],
          [44.2383, -20.8973],
          [48.4277, -18.2813],
          [52.7344, -15.461],
          [57.1289, -12.466],
          [61.6992, -9.3195],
          [66.3574, -6.0138],
          [71.1035, -2.6357],
          [75.9375, 0.7031],
          [80.8594, 3.952],
          [85.8691, 6.9679],
          [90.9668, 9.5372],
          [95.625, 11.7814],
          [100.1953, 13.4106],
          [104.7656, 14.4458],
          [109.3359, 15.2841],
          [113.9941, 16.0462],
          [118.6523, 17.1429],
          [122.039, 20.6328],
          [121.4942, 25.033], // Keelung, Taiwan
          [120.2197, 30.0444], // Approaching Shanghai
          [121.4737, 31.2304], // Shanghai
        ],
      },
    },
  ],
};

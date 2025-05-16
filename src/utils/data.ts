import { Math as CesiumMath, HeadingPitchRange } from "cesium";
import type { FeatureCollection } from "geojson";
import generalCargo from "../assets/models/cargo.glb";
import warship from "../assets/models/warship.glb";
import type { ShipType } from "./types";

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

export const ships: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        MMSI: 636018792,
        name: "MSC ASTRID",
        type: "Container Ship",
        flag: "Liberia",
        age: 12,
        speed: 40,
        origin: "Colombo",
        destination: "Mombasa",
      },

      geometry: {
        type: "LineString",
        coordinates: [
          [79.85, 6.87],
          [71, -1.0],
          [39.74, -4.06],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 419001234,
        name: "SSL GUJARAT",
        type: "Container Ship",
        flag: "India",
        age: 15,
        speed: 45,
        origin: "Kochi",
        destination: "Colombo",
      },

      geometry: {
        type: "LineString",
        coordinates: [
          [76.21, 9.98],
          [76.51, 7.07],
          [78.27, 6.26],
          [79.82, 6.92],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 431999567,
        name: "JS Izumo",
        type: "Destroyer",
        flag: "Japan",
        age: 10,
        speed: 100,
        origin: "Hakata",
        destination: "Busan",
      },

      geometry: {
        type: "LineString",
        coordinates: [
          [130.38, 33.62],
          [130.24, 33.62],
          [130.26, 33.66],
          [130.35, 33.63],
          [130.33, 33.64],
          [130.3, 33.65],
          [130.26, 33.65],
          [130.26, 33.71],
          [130.2, 33.79],
          [130.04, 33.76],
          [129.87, 34.37],
          [129.71, 34.98],
          [129.42, 35.13],
          [129.09, 35.07],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        MMSI: 235092400,
        name: "JACKSONVILLE EXPRESS",
        type: "Container Ship",
        flag: "Puerto Rico",
        age: 5,
        speed: 45,
        origin: "Savannah",
        destination: "San Juan",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-80.91, 31.88],
          [-71.96, 29.35],
          [-67.67, 23.42],
          [-66.07, 18.47],
        ],
      },
    },

    {
      type: "Feature",
      properties: {
        MMSI: 777092406,
        name: "CMA CGM Marco Polo",
        type: "Container Ship",
        flag: "Portugal",
        age: 3,
        speed: 40,
        origin: "Lisbon",
        destination: "Angola",
      },

      geometry: {
        type: "LineString",
        coordinates: [
          [-9.28, 38.64],
          [-33.09, 25.13],
          [-34.26, 12.6],
          [12.08, -15.17],
        ],
      },
    },
  ],
};

export const shipModels: Record<ShipType, string> = {
  "Container Ship": generalCargo,
  "General Cargo Ship": generalCargo,
  Destroyer: warship,
};

import { HeadingPitchRange } from "cesium";

export interface CameraOffset extends HeadingPitchRange {
  height?: number;
}

export interface ShipFeatureProperties {
  MMSI: number;
  name: string;
  type: string;
  flag: string;
  age: number;
  grossTonnage: number;
}

export interface ShipFeatureGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

export interface ShipFeature {
  type: "Feature";
  properties: ShipFeatureProperties;
  geometry: ShipFeatureGeometry;
}

export interface ShipFeatureCollection {
  type: "FeatureCollection";
  features: ShipFeature[];
}

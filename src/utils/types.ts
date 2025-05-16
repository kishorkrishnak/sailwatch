export type ShipType = "Container Ship" | "General Cargo Ship" | "Destroyer";
import type { Feature } from "geojson";

export type DangerZoneStatus = {
  status: string;
  criticalZone: {
    name: string | null;
    distance: number | null;
  };
};


export type RbushFeatureItem = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  feature: Feature;
};

export type ShipType = "Container Ship" | "General Cargo Ship" | "Destroyer";

export type DangerZoneStatus = {
  status: string;
  criticalZone: {
    name: string | null;
    distance: number | null;
  };
};

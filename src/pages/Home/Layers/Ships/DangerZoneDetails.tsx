import type { DangerZoneStatus } from "../../../../utils/types";

const DangerZoneDetails = ({
  dangerZoneStatus,
}: {
  dangerZoneStatus: DangerZoneStatus | null;
}) => {
  return (
    <div className="mt-4 p-3 border rounded-lg bg-gray-50">
      <p className="text-sm text-gray-600 mb-1 font-medium">
        Danger Zone Status:
      </p>

      {dangerZoneStatus?.status === "Clear" && (
        <p className="text-green-600 font-semibold flex items-center space-x-2">
          <span>🟢</span>
          <span>Clear - No Danger Zones Nearby</span>
        </p>
      )}

      {dangerZoneStatus?.status === "Approaching Danger Zone" &&
        dangerZoneStatus.criticalZone && (
          <p className="text-yellow-600 font-semibold flex flex-col space-y-1">
            <span className="flex items-center space-x-2">
              <span>🟠</span>
              <span>Approaching Danger Zone:</span>
            </span>
            <span className="ml-6">
              Zone: <strong>{dangerZoneStatus.criticalZone.name}</strong>
            </span>
            <span className="ml-6">
              Distance:{" "}
              <strong>{dangerZoneStatus.criticalZone.distance} km</strong>
            </span>
          </p>
        )}

      {dangerZoneStatus?.status === "Inside Danger Zone" &&
        dangerZoneStatus.criticalZone && (
          <p className="text-red-600 font-semibold flex flex-col space-y-1">
            <span className="flex items-center space-x-2">
              <span>🔴</span>
              <span>Inside Danger Zone:</span>
            </span>
            <span className="ml-6">
              Zone: <strong>{dangerZoneStatus.criticalZone.name}</strong>
            </span>
          </p>
        )}
    </div>
  );
};

export default DangerZoneDetails;

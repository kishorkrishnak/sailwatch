import { HeadingPitchRange } from "cesium";
import { useCesium } from "resium";
import { useAppContext } from "../../../../contexts/AppContext";
import { cameraModeOffsets } from "../../../../utils/data";

type CameraModesProps = {
  selectedCameraMode: string;
  setSelectedCameraMode: (mode: string) => void;
};

function CameraModes({
  selectedCameraMode,
  setSelectedCameraMode,
}: CameraModesProps) {
  const { selectedShip, shipEntities } = useAppContext();
  const { viewer } = useCesium();

  const handleFocus = () => {
    if (!viewer) return;
    const entity = shipEntities.find(
      (e) => e.feature === selectedShip
    )?.cesiumEntity;
    if (!entity) return;

    if (selectedCameraMode === "Ship") {
      viewer.trackedEntity = entity;
      return;
    }

    viewer.trackedEntity = undefined;
    const currentTime = viewer.clock.currentTime;
    const entityPosition = entity.position.getValue(currentTime);
    if (!entityPosition) return;

    const { heading, pitch, range } =
      cameraModeOffsets[selectedCameraMode] || {};
    viewer.scene.camera.setView({
      destination: entityPosition,
      orientation: { heading, pitch, roll: 0 },
    });

    setTimeout(() => {
      viewer.zoomTo(entity, new HeadingPitchRange(heading, pitch, range));
    }, 100);
  };

  return (
    <div className="mt-3 space-y-2 text-sm">
      <p className="font-medium text-gray-700">Camera Mode:</p>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(cameraModeOffsets).map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedCameraMode(mode)}
            className={`px-3 py-1 rounded-md border text-xs ${
              selectedCameraMode === mode
                ? "bg-blue-500 text-white"
                : "border-gray-400"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <button
        onClick={handleFocus}
        className="w-full bg-[#2c3e50] hover:bg-[#1a252f] text-white py-2 rounded-md"
      >
        Focus
      </button>
    </div>
  );
}

export default CameraModes;

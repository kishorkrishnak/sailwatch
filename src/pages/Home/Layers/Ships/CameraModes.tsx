import { Cartesian3, HeadingPitchRange } from "cesium";
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

    const scene = viewer.scene;
    const camera = scene.camera;

    const { heading, pitch, range } =
      cameraModeOffsets[selectedCameraMode] || {};

    const destination = Cartesian3.clone(entityPosition);
    camera.setView({
      destination: destination,
      orientation: {
        heading: heading,
        pitch: pitch,
        roll: 0,
      },
    });

    setTimeout(() => {
      const cameraOffset = new HeadingPitchRange(heading, pitch, range);

      viewer.zoomTo(entity, cameraOffset);
    }, 100);
  };

  return (
    <div className="mt-3 flex flex-col items-start gap-1">
      <label
        htmlFor="cameraMode"
        className="text-sm font-medium text-gray-700 block"
      >
        Camera Mode:
      </label>
      <div className="flex mt-4 gap-3 flex-wrap text-sm">
        {Object.keys(cameraModeOffsets).map((mode) => (
          <div
            key={mode}
            onClick={() => {
              setSelectedCameraMode(mode);
            }}
            className={`cursor-pointer p-3 border border-black rounded-lg ${
              selectedCameraMode === mode ? "bg-blue-500 text-white" : ""
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </div>
        ))}
      </div>
      <button
        onClick={handleFocus}
        className="w-full mt-4 bg-[#2c3e50] hover:bg-[#1a252f] text-white py-2 px-4 rounded-lg transition duration-200"
      >
        Refocus
      </button>
    </div>
  );
}

export default CameraModes;

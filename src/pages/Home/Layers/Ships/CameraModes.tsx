import { HeadingPitchRange, ScreenSpaceEventType } from "cesium";
import { useEffect } from "react";
import { useCesium } from "resium";
import { useAppContext } from "../../../../contexts/AppContext";
import { cameraModeOffsets } from "../../../../utils/data";

const CameraModes = () => {
  const {
    selectedShip,
    selectedCameraMode,
    setSelectedCameraMode,
  } = useAppContext();

  const { viewer, } = useCesium();

  const handleFocus = () => {
    if (!viewer) return;

    if (!selectedShip?.cesiumEntity) return;

    if (selectedCameraMode === "Ship") {
      viewer.trackedEntity = selectedShip.cesiumEntity;
      return;
    }

    viewer.trackedEntity = undefined;
    const currentTime = viewer.clock.currentTime;
    const entityPosition = selectedShip.cesiumEntity.position.getValue(currentTime);
    if (!entityPosition) return;

    const { heading, pitch, range } =
      cameraModeOffsets[selectedCameraMode] || {};
    viewer.scene.camera.setView({
      destination: entityPosition,
      orientation: { heading, pitch, roll: 0 },
    });

    setTimeout(() => {
      viewer.zoomTo(selectedShip.cesiumEntity, new HeadingPitchRange(heading, pitch, range));
    }, 100);
  };

  useEffect(() => {
    if (!viewer) return;

    //prevent the default entity focus and tracking on doubleclick
    viewer.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
  }, [viewer]);

  return (
    <div className="p-3 bg-white/90 rounded-2xl w-fit  h-fit absolute top-5 left-5 space-y-2 text-sm">
      <p className="font-medium text-gray-700">Ship Camera Mode:</p>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(cameraModeOffsets).map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedCameraMode(mode)}
            className={`px-3 py-1 rounded-md border text-xs ${selectedCameraMode === mode
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
};

export default CameraModes;

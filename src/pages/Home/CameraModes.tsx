import { cameraModeOffsets } from "../../utils/data";

type CameraModesProps = {
  handleFocus: () => void;
  selectedCameraMode: string;
  setSelectedCameraMode: (mode: string) => void;
};

function CameraModes({
  selectedCameraMode,
  setSelectedCameraMode,
}: CameraModesProps) {
  return (
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
  );
}

export default CameraModes;

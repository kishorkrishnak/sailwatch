import CameraModes from "./CameraModes";

const ShipInfo = ({
  selectedFeature,
  handleFocus,
  selectedCameraMode,
  setSelectedCameraMode,
}) => {
  return (
    <div className="absolute bottom-5 right-5 bg-white/80 p-4 rounded-lg w-[280px] shadow-md z-[1000]">
      <h1 className="font-semibold text-xl">
        {selectedFeature.properties.name}
      </h1>
      <p style={{ margin: "8px 0" }}>
        {selectedFeature.properties.popupContent}
      </p>

      <div className="flex flex-col gap-3 mt-3">
        <button
          onClick={handleFocus}
          className="px-3 py-2 bg-[#2c3e50] text-white rounded cursor-pointer"
        >
          Focus Camera
        </button>

        <div>
          <label htmlFor="cameraMode" className="block mt-2">
            Camera Mode:
          </label>

          <CameraModes
            handleFocus={handleFocus}
            selectedCameraMode={selectedCameraMode}
            setSelectedCameraMode={setSelectedCameraMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ShipInfo;

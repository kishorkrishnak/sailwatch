import './ShipInfo.css'

const ShipInfo = ({
  selectedFeature,
  cameraDistance,
  handleFocus,
  setCameraDistance,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#ffffffcc",
        padding: "16px",
        borderRadius: "8px",
        width: "280px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <h3 style={{ margin: 0 }}>{selectedFeature.properties.name}</h3>
      <p style={{ margin: "8px 0" }}>
        {selectedFeature.properties.popupContent}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <button
          onClick={handleFocus}
          style={{
            padding: "8px 12px",
            backgroundColor: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Focus Camera
        </button>

        <div>
          <label
            htmlFor="cameraDistance"
            style={{ display: "block", marginBottom: "4px" }}
          >
            Camera Distance: {cameraDistance / 1000} km 
          </label>
          <input
            id="cameraDistance"
            type="range"
            min="500"
            max="3000"
            step="100"
            value={cameraDistance}
            onChange={(e) => setCameraDistance(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShipInfo;

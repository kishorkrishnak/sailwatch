import { BoundingSphere, Cartesian3 } from "cesium";
import { useState } from "react";
import { CameraFlyToBoundingSphere, Entity, Viewer } from "resium";
import shipNavy from "./assets/models/ship_navy.glb";
import ShipInfo from "./components/ShipInfo";
import { cameraModeOffsets, shipPositions } from "./utils/data";

function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedCameraMode, setSelectedCameraMode] = useState("default");
  const [shouldFly, setShouldFly] = useState(false);

  const handleFocus = () => {
    setShouldFly(true);
  };

  return (
    <>
      <Viewer full timeline={false} infoBox={false}>
        {shipPositions.features.map((feature, index) => {
          if (feature.geometry.type === "Point") {
            const [lon, lat] = feature.geometry.coordinates;
            const position = Cartesian3.fromDegrees(lon, lat);
            return (
              <Entity
                key={index}
                onClick={() => setSelectedFeature(feature)}
                name={feature.properties?.name || `Ship ${index + 1}`}
                position={position}
                model={{
                  uri: shipNavy,
                  scale: 20,
                  minimumPixelSize: 100,
                }}
                description={feature.properties?.popupContent}
              />
            );
          }
          return null;
        })}

        {shouldFly && selectedFeature && (
          <CameraFlyToBoundingSphere
            boundingSphere={BoundingSphere.fromPoints([
              Cartesian3.fromDegrees(
                selectedFeature.geometry.coordinates[0],
                selectedFeature.geometry.coordinates[1]
              ),
            ])}
            duration={1.5}
            offset={cameraModeOffsets[selectedCameraMode]}
            onComplete={() => setShouldFly(false)}
          />
        )}
      </Viewer>

      {selectedFeature && (
        <ShipInfo
          handleFocus={handleFocus}
          selectedFeature={selectedFeature}
          selectedCameraMode={selectedCameraMode}
          setSelectedCameraMode={setSelectedCameraMode}
        />
      )}
    </>
  );
}

export default App;

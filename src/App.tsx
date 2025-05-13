import { BoundingSphere, Cartesian3 } from "cesium";
import { useState } from "react";
import { CameraFlyToBoundingSphere, Entity, Viewer } from "resium";
import shipNavy from "./assets/models/ship_navy.glb";
import ShipInfo from "./components/ShipInfo";
import { cameraModeOffsets } from "./utils/data";

const positions = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Ever Given",
        popupContent: "Ever Given is a famous container ship.",
      },
      geometry: {
        type: "Point",
        coordinates: [30.5852, 31.5242],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "MSC Meraviglia",
        popupContent: "MSC Meraviglia is a large cruise ship.",
      },
      geometry: {
        type: "Point",
        coordinates: [41.7025, 14.9732],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Maersk Alabama",
        popupContent: "Maersk Alabama operates in international waters.",
      },
      geometry: {
        type: "Point",
        coordinates: [80.7718, 5.5],
      },
    },
  ],
};

function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [shouldFly, setShouldFly] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(800);

  const handleFocus = () => {
    setShouldFly(true);
  };

  return (
    <>
      <Viewer full timeline={false} infoBox={false}>
        {positions.features.map((feature, index) => {
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
            offset={{
              ...cameraModeOffsets.Default,
              range: cameraDistance,
            }}
            onComplete={() => setShouldFly(false)}
          />
        )}
      </Viewer>

      {selectedFeature && (
        <ShipInfo
          cameraDistance={cameraDistance}
          handleFocus={handleFocus}
          selectedFeature={selectedFeature}
          setCameraDistance={setCameraDistance}
        />
      )}
    </>
  );
}

export default App;

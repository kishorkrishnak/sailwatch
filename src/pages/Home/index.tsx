import { BoundingSphere, Cartesian3 } from "cesium";
import { CameraFlyToBoundingSphere, Entity, Viewer } from "resium";
import shipNavy from "../../assets/models/ship_navy.glb";
import ShipInfo from "./ShipInfo";
import useAppContext from "../../contexts/AppContext/useAppContext";
import { cameraModeOffsets, shipPositions } from "../../utils/data";
const Home = () => {
  const {
    selectedFeature,
    setSelectedFeature,
    selectedCameraMode,
    setSelectedCameraMode,
    shouldFly,
    setShouldFly,
    handleFocus,
  } = useAppContext();

  return (
    <>
      <Viewer full timeline={false} infoBox={false} selectionIndicator={false}>
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
                selectedFeature.geometry.coordinates[1],
                cameraModeOffsets[selectedCameraMode].height || 0
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
};

export default Home;

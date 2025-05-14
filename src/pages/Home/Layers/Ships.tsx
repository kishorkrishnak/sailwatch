import { Color, HeightReference, PolylineGlowMaterialProperty, TimeInterval, TimeIntervalCollection } from "cesium";
import { Entity } from "resium";
import useAppContext from "../../../contexts/AppContext/useAppContext";
import shipNavy from "../../../assets/models/ship_navy.glb";

const Ships = () => {
    const { viewerRef, shipEntities, startTime, endTime, setSelectedFeature } =
        useAppContext();
    return (
        <>
            {shipEntities.map((shipEntity, index) => (
                <Entity
                    key={index}
                    ref={(ref) => {
                        if (ref?.cesiumElement) {
                            shipEntities[index].cesiumEntity = ref.cesiumElement;
                        }
                    }}
                    availability={
                        new TimeIntervalCollection([
                            new TimeInterval({
                                start: startTime,
                                stop: endTime,
                            }),
                        ])
                    }
                    onClick={() => {
                        viewerRef.current.trackedEntity = undefined;
                        setSelectedFeature(shipEntity.feature);
                    }}
                    name={shipEntity.name}
                    position={shipEntity.position}
                    model={{
                        uri: shipNavy,
                        scale: 30,
                        minimumPixelSize: 128,
                        heightReference: HeightReference.CLAMP_TO_TERRAIN,
                    }}
                    // path={{
                    //     resolution: 1,
                    //     material: new PolylineGlowMaterialProperty({
                    //         glowPower: 0.1,
                    //         color: Color.YELLOW,
                    //     }),
                    //     width: 10,
                    // }}
                    orientation={shipEntity.orientation}
                    description={shipEntity.description}
                />
            ))}
        </>
    );
};

export default Ships;

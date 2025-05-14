import { GeoJsonDataSource } from "resium";
import { Color } from "cesium";
import React from "react";

const DangerZones = () => {
    const geoJson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    name: "Restricted Area",
                },
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [120.0, 30.0],
                            [121.0, 30.0],
                            [121.0, 31.0],
                            [120.0, 31.0],
                            [120.0, 30.0],
                        ],
                    ],
                },
            },
        ],
    };

    return (
        <GeoJsonDataSource
            clampToGround={true}
            data={`/data/Danger_Zones_and_Restricted_Areas.geojson`}
            //   stroke={Color.RED}
            fill={Color.RED.withAlpha(0.4)}
            //   strokeWidth={3}

            show
        />
    );
};

export default DangerZones;

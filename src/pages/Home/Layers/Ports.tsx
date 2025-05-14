import React from 'react'
import { GeoJsonDataSource } from 'resium';
import shipNavy from "../../../assets/models/ship_navy.glb";

const Ports = () => {
  return (
    <GeoJsonDataSource
        data={'/data/ports.geojson'}
        onLoad={dataSource => {
          dataSource.entities.values.forEach(entity => {
            console.log()
           
          });
        }}
      />
  )
}

export default Ports

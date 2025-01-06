import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import TileWMS from 'ol/source/TileWMS.js';
import VectorDraw from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';
import * as olExtent from 'ol/extent';
function MapaCatastral(props) {
    const {data,capa,infoPredio} = props;
    const refMapa = useRef(null);
    const mapa = useRef(null);
    function IniciarMapa(){
        mapa.current = new Map({
            layers: [
                new TileLayer({
                    text: "OSM",
                    title: "OSM",
                    baseLayer: true,
                    source: new OSM(),
                })
            ],
            view: new View({
                center: [-7001255.85019353, -1929169.13252504],
                //center:olExtent.getCenter(capaVector.getSource().getExtent()),
                zoom: 12
            })
        });
        var capaTrabajadas=new Image({
            text: 'Trabajadas',
            title: 'Trabajadas/no Trabajadas',
            visible: true,
            baseLayer: false,
            source: new ImageWMS({
                url: "https://geo.forestryai.cl/geoserver/wms",
                params: {
                    'LAYERS':`cite:${capa}`,
                    transparent: true,
                    format: 'image/png', 'SRS': 'EPSG:900913'
                },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
        })
        var capaVector = new VectorLayer({
            text: 'Catastral',
            title: 'Capa Catastral',
            visible: true,
            baseLayer: false,
            source: new VectorDraw({
                features: new GeoJSON().readFeatures(data, {
                    dataProjection: data.crs.properties.name,
                    featureProjection: mapa.current.getView().getProjection()
                })
            }),
            style: {
                'fill-color': 'rgba(255, 255, 255, 0)',
                'stroke-color': '#8000FF',
                'stroke-width': 2,
                'circle-radius': 10,
                'circle-fill-color': '#ffcc33',
            },
        });
        capaTrabajadas.getSource().updateParams({ 'CQL_FILTER': `property_i=${infoPredio.fid}` });
        capaTrabajadas.getSource().refresh();
        mapa.current.addLayer(capaTrabajadas);
        mapa.current.addLayer(capaVector);
        mapa.current.setTarget(refMapa.current)
        var extent = capaVector.getSource().getExtent();
        mapa.current.getView().fit(extent,mapa.current.getSize())
    }
    useEffect(()=>{
        if(mapa.current==null){
            IniciarMapa()
        }
    },[])
    return (
        <div className='w-100' style={{height:'500px'}} ref={refMapa}>
        </div>
    )
}

export default MapaCatastral

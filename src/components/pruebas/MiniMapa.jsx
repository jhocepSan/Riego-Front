import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';
import * as olExtent from 'ol/extent';
function MiniMapa(props) {
    const {geometry,fecha,area} = props;
    const refMapa = useRef(null);
    const mapa = useRef(null);
    function IniciarMapa(){
        var capa = geometry.capa
        capa.setStyle({
            'stroke-color': '#8000FF',
            'stroke-width': 2,
            'circle-radius': 10,
            'circle-fill-color': '#ffcc33',
        })
        var zom = area<0.6?17:15
        mapa.current = new Map({
            layers: [
                new TileLayer({
                    text: "OSM",
                    title: "OSM",
                    baseLayer: true,
                    source: new OSM(),
                }),
                new TileLayer({
                    text: "Mapa Base",
                    title: "Mapa Base",
                    legendUrl: 'ortofoto.png',
                    visible: true,
                    baseLayer: true,
                    source: new XYZ({
                        url: `https://tiles.planet.com/basemaps/v1/planet-tiles/planet_medres_normalized_analytic_${fecha}_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK31bee355492c468fb692578ca46380b8`
                    })
                }),
                capa
            ],
            view: new View({
                //center: [-7001255.85019353, -1929169.13252504],
                center:olExtent.getCenter(geometry.geometry.extent_),
                zoom: zom
            })
        });
        mapa.current.setTarget(refMapa.current)
    }
    useEffect(()=>{
        if(mapa.current==null){
            IniciarMapa()
        }
    },[])
    return (
        <div className='w-100' style={{height:'250px'}} ref={refMapa}>
        </div>
    )
}

export default MiniMapa

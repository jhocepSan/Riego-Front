import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';;
import VectorDraw from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS.js';
import * as olExtent from 'ol/extent';
import {getFecha,getFechaNumerica} from '../Utils/DateConverter';

function MiniMapaEstadistica(props) {
    const { fechas,geometria,info,tipoGeometria} = props;
    const refMapa = useRef(null);
    const mapa = useRef(null);
    const [geometrya,setGeometrya]=useState(null);
    function IniciarMapa() {
        var geo = "POLYGON (("
        if (geometria.coordinates==undefined){
            for (var i of geometria[0][0]) {
                geo += i[0] + " " + i[1] + ","
            }
        }else{
            if(tipoGeometria=='S'){
                for (var i of geometria.coordinates[0][0]) {
                    geo += i[0] + " " + i[1] + ","
                }
            }
            if(tipoGeometria=='D'){
                for (var i of geometria.coordinates[0]) {
                    geo += i[0] + " " + i[1] + ","
                }
            }
        }
        var geometrya = geo.slice(0, geo.length - 1);
        geometrya += "))"
        var data = {
            "type": "FeatureCollection",
            "name": "miniGeometria",
            "crs": {
                "type": "name",
                "properties": {
                    "name": "urn:ogc:def:crs:EPSG::3857"
                }
            },
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "id": 1
                    },
                    "geometry": {
                        "type": tipoGeometria=='D'?'Polygon':"MultiPolygon",
                        "coordinates": geometria.coordinates==undefined?geometria:geometria.coordinates
                    }
                }
            ]
        }
        /*var fechaIni,fechaFin;
        if(info.std==true){
            if(info.id=='SWC'){
                fechaIni=fechas.fecha;
                fechaFin=fechas.fecha;
            }else{
                if(fechas.from!=undefined){
                    fechaIni=fechas.from.substring(0, 10);
                    fechaFin=fechas.to.substring(0, 10);
                }else{
                    fechaIni=fechas.substring(0, 10);
                    fechaFin=getFecha(fechas,4).toISOString().slice(0, 10);
                }
            }
        }else{
            fechaIni=fechas.substring(0, 10);
            fechaFin=getFecha(fechas,1).toISOString().slice(0, 10);;
        }*/
        mapa.current = new Map({
            layers: [
                new TileLayer({
                    text: "OSM",
                    title: "OSM",
                    visible: false,
                    baseLayer: true,
                    source: new OSM(),
                }),
                new TileLayer({
                    text: "OSM Terre",
                    title: "OSM Terre",
                    visible: true,
                    baseLayer: true,
                    legendUrl: 'sateliteBlanco.png',
                    preview: 'sateliteBlanco.png',
                    source: new TileWMS({
                        url: 'https://ows.terrestris.de/osm-gray/service',
                        params: { 'LAYERS': 'OSM-WMS', 'TILED': true }
                    })
                }),
                new Image({
                    text: 'ortofoto',
                    title: 'ortofoto',
                    visible: true,
                    baseLayer: false,
                    source: new ImageWMS({
                        url: "https://geon.forestryai.cl/geoserver/wms",
                        params: {
                            'LAYERS': 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_swc',
                            transparent: true,
                            format: 'image/png', 'SRS': 'EPSG:3857'
                        },
                        ratio: 1,
                        serverType: 'geoserver',
                        crossOrigin: 'anonymous'
                    })
                })
            ],
            view: new View({
                center: [-7001255.85019353, -1929169.13252504],
                zoom: 12
            })
        });
        var capaVector = new VectorLayer({
            text: 'caminos',
            title: 'Capa Caminos',
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
        mapa.current.addLayer(capaVector)
        mapa.current.getView().setCenter(olExtent.getCenter(capaVector.getSource().getExtent()))
        mapa.current.getView().fit(capaVector.getSource().getExtent())
        mapa.current.getView().animate({ center: capaVector.getSource().getExtent() }, { duration: 750 })
        mapa.current.setTarget(refMapa.current)
        mapa.current.changed()
    }
    function actualizarMapa(){
        mapa.current.getLayers().forEach(function (layer) {
            if (layer instanceof Image) {
                if (layer.values_.text == 'ortofoto') {
                    layer.getSource().updateParams({
                        'LAYERS': 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_swc',
                    })
                    layer.setVisible(true);
                    //mapa.current.getView().setCenter(olExtent.getCenter(layer.getSource().getExtent()))
                    //mapa.current.getView().fit(layer.getSource().getExtent())
                }
            }
        })
        mapa.current.changed()
    }
    useEffect(() => {
        if (mapa.current == null) {
            IniciarMapa()
        }else{
            actualizarMapa();
        }
    }, [fechas])
    return (
        <div className='w-100' style={{ height: '360px' }} ref={refMapa}>
        </div>
    )
}

export default MiniMapaEstadistica

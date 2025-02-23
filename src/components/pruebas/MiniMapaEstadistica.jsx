import React, { useContext, useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import VectorDraw from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS.js';
import * as olExtent from 'ol/extent';
import { getFecha, getFechaNumerica } from '../Utils/DateConverter';
import MsgUtils from '../Utils/MsgUtils';
import PlanetApi from '../Sql/PlanetApi';
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

function MiniMapaEstadistica(props) {
    const { fechas, geometria, info, tipoGeometria, geoPano, size, utb } = props;
    const refMapa = useRef(null);
    const mapa = useRef(null);
    const [verBotones, setVerBotones] = useState(false);
    const [capa1, setCapa1] = useState(false);
    const [capa2, setCapa2] = useState(false);
    const [capa3, setCapa3] = useState(false);
    const [capa4, setCapa4] = useState(false);
    function IniciarMapa() {
        var geo = "POLYGON (("
        if (geometria.coordinates == undefined) {
            for (var i of geometria[0][0]) {
                geo += i[0] + " " + i[1] + ","
            }
        } else {
            if (tipoGeometria == 'S') {
                for (var i of geometria.coordinates[0][0]) {
                    geo += i[0] + " " + i[1] + ","
                }
            }
            if (tipoGeometria == 'D') {
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
                        "type": tipoGeometria == 'D' ? 'Polygon' : "MultiPolygon",
                        "coordinates": geometria.coordinates == undefined ? geometria : geometria.coordinates
                    }
                }
            ]
        }
        var nombreFecha = ''
        if(info.id=='SWC'){
            nombreFecha = 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_swc'
        }else if(info.id=='TEMP'){
            nombreFecha = 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_1330_tem'
        }else {
            nombreFecha = 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_0130_tem'
        }
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
                            'LAYERS': nombreFecha,
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
        var capaNueva = new Image({
            text: 'riego',
            title: 'Control Riego',
            visible: false,
            baseLayer: false,
            source: new ImageWMS({
                url: "https://geon.forestryai.cl/geoserver/wms",
                params: {
                    'LAYERS': 'cite:ri_control_riego',
                    transparent: true,
                    format: 'image/png', 'SRS': 'EPSG:3857'
                },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
        });
        var canalesRiego = new Image({
            text: 'canales',
            title: 'Canales Riego',
            visible: false,
            baseLayer: false,
            preview: "limites.png",
            source: new ImageWMS({
                url: "https://geo.forestryai.cl/geoserver/wms",
                params: {
                    'LAYERS': 'cite:canales_riego',
                    transparent: true,
                    format: 'image/png', 'SRS': 'EPSG:3857'
                },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
        });
        var capaNiveles = new Image({
            text: 'curvasnivel',
            title: 'Curvas de Nivel',
            visible: false,
            baseLayer: false,
            source: new ImageWMS({
                url: "https://geon.forestryai.cl/geoserver/wms",
                params: {
                    'LAYERS': 'cite:ri_curvas_nivel',
                    transparent: true,
                    format: 'image/png', 'SRS': 'EPSG:3857'
                },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
        });
        mapa.current.addLayer(capaVector);
        mapa.current.addLayer(capaNueva);
        mapa.current.addLayer(canalesRiego);
        mapa.current.addLayer(capaNiveles);
        if (geoPano != null) {
            var dataPano = {
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
                        "geometry": geoPano
                    }
                ]
            }
            var capaVectorPano = new VectorLayer({
                text: 'panio',
                title: 'Capa Paño',
                visible: true,
                baseLayer: false,
                source: new VectorDraw({
                    features: new GeoJSON().readFeatures(dataPano, {
                        dataProjection: dataPano.crs.properties.name,
                        featureProjection: mapa.current.getView().getProjection()
                    })
                }),
                style: {
                    'fill-color': 'rgba(55, 81, 226, 0.93)',
                    'stroke-color': '#8000FF',
                    'stroke-width': 2,
                    'circle-radius': 10,
                    'circle-fill-color': '#ffcc33',
                },
            });
            mapa.current.addLayer(capaVectorPano);
        }
        mapa.current.getView().setCenter(olExtent.getCenter(capaVector.getSource().getExtent()))
        mapa.current.getView().fit(capaVector.getSource().getExtent())
        mapa.current.getView().animate({ center: capaVector.getSource().getExtent() }, { duration: 750 })
        mapa.current.setTarget(refMapa.current)
        mapa.current.changed()
        setVerBotones(true);
    }
    function actualizarMapa() {
        var nombreFecha = ''
        if(info.id=='SWC'){
            nombreFecha = 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_swc'
        }else if(info.id=='TEMP'){
            nombreFecha = 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_1330_tem'
        }else {
            nombreFecha = 'cite:' + getFechaNumerica(fechas.fecha, 0) + '_0130_tem'
        }
        mapa.current.getLayers().forEach(function (layer) {
            if (layer instanceof Image) {
                if (layer.values_.text == 'ortofoto') {
                    layer.getSource().updateParams({
                        'LAYERS': nombreFecha,
                    })
                    layer.setVisible(true);
                    //mapa.current.getView().setCenter(olExtent.getCenter(layer.getSource().getExtent()))
                    //mapa.current.getView().fit(layer.getSource().getExtent())
                }
            }
        })
        mapa.current.changed()
        if (utb == true && capa4 == true) {
            obtenerDatosUtbFecha()
        }
    }
    const obtenerDatosUtbFecha = async () => {
        try {
            var result = await PlanetApi.getUtbClasificadoDay({ 'fecha': fechas.fecha, 'gid': fechas.gid_poligono })
            if (result.ok) {
                var features = []
                for (var geom of result.ok) {
                    features.push({
                        "type": "Feature",
                        "properties": {
                            "id": geom.gid,
                            "regado": geom.regado,
                            "area": geom.f_sup_ha_u
                        },
                        "geometry": JSON.parse(geom.geometria)
                    })
                }
                var dataUtb = {
                    "type": "FeatureCollection",
                    "name": "miniGeometria",
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "urn:ogc:def:crs:EPSG::3857"
                        }
                    },
                    "features": features
                }
                var capaUtb = getCapa('utb');
                if (capaUtb == null) {
                    var capaUtbDay = new VectorLayer({
                        text: 'utb',
                        title: 'utb',
                        visible: false,
                        baseLayer: false,
                        source: new VectorDraw({
                            features: new GeoJSON().readFeatures(dataUtb, {
                                dataProjection: dataUtb.crs.properties.name,
                                featureProjection: mapa.current.getView().getProjection()
                            })
                        }),
                        style: function (feature) {
                            const tipo = feature.get('regado');
                            let color, borde;
                            if (tipo === 2) {
                                color = '#b3ffb3';
                                borde = '#4dff4d';
                            } else if (tipo === 1) {
                                color = '#f0ff4d';
                                borde = '#ffff00';
                            } else if (tipo === 0) {
                                color = '#ff4d4d';
                                borde = '#ff1a1a';
                            } else {
                                color = '#ff4d4d';
                                borde = '#ff1a1a';
                            }
                            return new Style({
                                fill: new Fill({ color: color }),
                                stroke: new Stroke({ color: borde, width: 1 })
                            });
                        }
                    });
                    //mapa.current.addLayer(capaUtbDay);
                    mapa.current.getLayers().insertAt(3, capaUtbDay);
                }else{
                    capaUtb.setSource(new VectorDraw({
                        features: new GeoJSON().readFeatures(dataUtb, {
                            dataProjection: dataUtb.crs.properties.name,
                            featureProjection: mapa.current.getView().getProjection()
                        })
                    }))
                    mapa.current.changed()
                }
            } else {
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        } 
    }
    function getCapa(nombre) {
        var laye = null;
        mapa.current.getLayers().forEach(function (layer) {
            if (layer instanceof TileLayer) {
                if (layer.values_.text == nombre) {
                    laye = layer
                }
            } else if (layer instanceof Image) {
                if (layer.values_.text == nombre) {
                    laye = layer
                }
            } else if (layer instanceof VectorLayer) {
                if (layer.values_.text == nombre) {
                    laye = layer
                }
            }
        })
        return laye;
    }
    function eventoCapa(capa) {
        mapa.current.getLayers().forEach(function (layer) {
            if (layer instanceof Image) {
                if (layer.values_.text == capa) {
                    if (layer.getVisible() == true) {
                        layer.setVisible(false);
                        if (capa == 'curvasnivel') {
                            setCapa3(false);
                        } else if (capa == 'canales') {
                            setCapa2(false);
                        } else if (capa == 'riego') {
                            setCapa1(false);
                        } else if (capa == 'utb') {
                            setCapa4(false);
                        }
                    } else {
                        layer.setVisible(true);
                        if (capa == 'curvasnivel') {
                            setCapa3(true);
                        } else if (capa == 'canales') {
                            setCapa2(true);
                        } else if (capa == 'riego') {
                            setCapa1(true);
                        } else if (capa == 'utb') {
                            setCapa4(true);
                        }
                    }
                }
            }else if (layer instanceof VectorLayer) {
                if (layer.values_.text == capa) {
                    if(layer.getVisible()==true){
                        layer.setVisible(false);
                        if (capa == 'utb') {
                            setCapa4(false);
                        }
                    }else{
                        layer.setVisible(true);
                        if (capa == 'utb') {
                            setCapa4(true);
                        }
                    }
                }
            }
        })
        mapa.current.changed();
    }
    useEffect(() => {
        if (mapa.current == null) {
            IniciarMapa()
            obtenerDatosUtbFecha()
        } else {
            actualizarMapa();
        }
    }, [fechas])
    return (
        <>
            <div className='w-100 mx-auto position-relative' style={{ height: size }} ref={refMapa}>
                {verBotones == true && <span className="position-absolute button-0 start-50 translate-middle badge">
                    <div className='btn-group btn-group-sm'>
                        {info.id=='SWC'&&<button className={`btn btn-sm  ${capa1 == false ? 'btnMapaR' : 'btnMapaRR'} `} onClick={() => eventoCapa('riego')}>Riego</button>}
                        {info.id=='SWC'&&<button className={`btn btn-sm ${capa2 == false ? 'btnMapaR' : 'btnMapaRC'}  mx-1`} onClick={() => eventoCapa('canales')}>Canales</button>}
                        {info.id=='SWC'&&<button className={`btn btn-sm  ${capa3 == false ? 'btnMapaR' : 'btnMapaRN'}`} onClick={() => eventoCapa('curvasnivel')}>Curvas</button>}
                        {utb == true && <button className={`btn btn-sm  ${capa4 == false ? 'btnMapaR' : 'btnMapaRN'} mx-1`} onClick={() => eventoCapa('utb')}>UTBs</button>}
                    </div>
                </span>}
            </div>
        </>
    )
}

export default MiniMapaEstadistica

import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import VectorDraw from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import * as olExtent from 'ol/extent';

function MapaStadistica(props) {
    const { geometria, info,datoPredio, tipoGeometria,capa } = props
    const refMapa = useRef(null);
    const mapa = useRef(null);
    const [verBotones, setVerBotones] = useState(false);
    const [capa1, setCapa1] = useState(false);
    const [capa2, setCapa2] = useState(false);
    const [capa3, setCapa3] = useState(false);
    const [capa4, setCapa4] = useState(true);
    function IniciarMapa() {
        console.log(info);
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
        var mapa_predio = new Image({
            text: 'Predios',
            title: 'Predios',
            visible: true,
            baseLayer: false,
            preview: "limites.png",
            source: new ImageWMS({
                url: "https://geon.forestryai.cl/geoserver/wms",
                params: {
                    'LAYERS': info.capaUPF,
                    CQL_FILTER: capa.id==1? "gid=" + datoPredio.gid:'',
                    transparent: true,
                    format: 'image/png', 'SRS': 'EPSG:3857'
                },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
        });
        var capaUtb = new Image({
            text: 'utb',
            title: 'UTB',
            visible: true,
            baseLayer: false,
            source: new ImageWMS({
                url: "https://geon.forestryai.cl/geoserver/wms",
                params: {
                    'LAYERS': info.id=='SWC'?'cite:ri_utbs_riego_clase':info.capaUTB,
                    transparent: true,
                    format: 'image/png', 'SRS': 'EPSG:3857'
                },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
        })
        if(info.id=='SWC'){
            capaUtb.getSource().updateParams(`CQL_FILTER: ${capa.id!=3?"n_id=" + datoPredio.n_id:"n_id=" + datoPredio.n_id+" and gid="+datoPredio.gid}`)
        }else{
            capaUtb.getSource().updateParams(`CQL_FILTER: ${capa.id!=3?"n_id=" + datoPredio.n_id:"n_id=" + datoPredio.n_id+" and gid="+datoPredio.gid}`)
        }
        mapa.current = new Map({
            layers: [
                new TileLayer({
                    text: "OSM",
                    title: "OSM",
                    baseLayer: true,
                    source: new OSM(),
                }), capaNiveles,mapa_predio, capaUtb,capaNueva,canalesRiego
            ],
            view: new View({
                center: [-7001255.85019353, -1929169.13252504],
                //center: olExtent.getCenter(geometry.geometry.extent_),
                zoom: 12
            })
        });
        mapa.current.setTarget(refMapa.current)
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
        var capaVector = new VectorLayer({
            text: 'Elegido',
            title: 'Elegido',
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
        mapa.current.getView().setCenter(olExtent.getCenter(capaVector.getSource().getExtent()))
        //mapa.current.getView().fit(capaVector.getSource().getExtent())
        mapa.current.getView().animate({ center: capaVector.getSource().getExtent() }, { duration: 10 })
        mapa.current.changed()
        setVerBotones(true);
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
                        }else if (capa == 'utb') {
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
                        }else if (capa == 'utb') {
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
        }
    }, [])
    return (
        <div className='w-100 position-relative' style={{ height: '450px' }} ref={refMapa}>
            {verBotones == true && <span className="position-absolute button-0 start-50 translate-middle badge">
                <div className='btn-group btn-group-sm'>
                    {info.id=='SWC'&&<button className={`btn btn-sm  ${capa1 == false ? 'btnMapaR' : 'btnMapaRR'} `} onClick={() => eventoCapa('riego')}>Riego</button>}
                    {info.id=='SWC'&&<button className={`btn btn-sm ${capa2 == false ? 'btnMapaR' : 'btnMapaRC'}  mx-1`} onClick={() => eventoCapa('canales')}>Canales</button>}
                    {info.id=='SWC'&&<button className={`btn btn-sm  ${capa3 == false ? 'btnMapaR' : 'btnMapaRN'}`} onClick={() => eventoCapa('curvasnivel')}>Curvas</button>}
                    <button className={`btn btn-sm  ${capa4 == false ? 'btnMapaR' : 'btnMapaRU'} mx-1`} onClick={() => eventoCapa('utb')}>UTBs</button>
                </div>
            </span>}
        </div>
    )
}

export default MapaStadistica
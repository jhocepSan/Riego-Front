import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import XYZ from 'ol/source/XYZ.js';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import ButonOl from 'ol-ext/control/Button';
import LayerSwitcherImage from 'ol-ext/control/LayerSwitcherImage';
import Vector from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Draw from 'ol/interaction/Draw'
import DrawHole from 'ol-ext/interaction/DrawHole'
import { serverUrl } from '../Utils/UtilsAplication';
import { getDiasFecha, getFechaConvert, getDateFormat, getFecha } from '../Utils/DateConverter'
var vector = new Vector({
    name: 'Geometria',
    title: 'Geometria',
    baseLayer: false,
    preview: 'draw.png',
    source: new VectorSource()
})

function MapBaseSlider() {
    const refMapa = useRef();
    const activarDraw = useRef(false);
    const [mapa, setMapa] = useState(new Map({
        layers: [
            new TileLayer({
                text: "OSM",
                title: "OSM",
                baseLayer: true,
                source: new OSM(),
            }),
            /*new TileLayer({
                text: "Blanco Negro",
                title: "Blanco Negro",
                baseLayer: true,
                source: new Stamen({
                    layer: 'toner-lite',
                    crossOrigin: null
                }),
            }),*/
            new TileLayer({
                text: "Satelital",
                title: "Satelital",
                visible: false,
                baseLayer: true,
                source: new XYZ({
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    maxZoom: 49
                })
            }),
            new TileLayer({
                text: "Planet Mapa",
                title: "Planet Mapa",
                visible: false,
                baseLayer: true,
                source: new XYZ({
                    url: 'https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2023_02_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK930b9e9fd6444ff987df3e2c492742d4'
                })
            }),
            new TileLayer({
                text: "OSM Terre",
                title: "OSM Terre",
                visible: false,
                baseLayer: true,
                preview: 'sateliteBlanco.png',
                source: new TileWMS({
                    url: 'https://ows.terrestris.de/osm-gray/service',
                    params: { 'LAYERS': 'OSM-WMS', 'TILED': true }
                })
            })
        ],
        view: new View({
            center: [-7001255.85019353, -1929169.13252504],
            zoom: 12
        })
    }));
    function getLayerText(nombre) {
        var laye = null;
        mapa.getLayers().forEach(function (layer) {
            if (layer instanceof TileLayer) {
                if (layer.values_.text == nombre) {
                    laye = layer
                }
            } else if (layer instanceof Image) {
                if (layer.values_.text == nombre) {
                    laye = layer
                }
            }
        })
        return laye;
    }
    function changeDraw() {
        console.log("activando", activarDraw.current)
        if (activarDraw.current == false) {
            activarDraw.current=true;
            var draw = new Draw({
                source: vector.getSource(),
                type: 'Polygon'
            });
            mapa.addInteraction(draw);
            var drawhole = new DrawHole({
                layers: [vector]
            });
            drawhole.setActive(false);
            mapa.addInteraction(drawhole);
        } else {
            draw.setActive(false);
            drawhole.setActive(true);
            console.log("saludos terricola")
            activarDraw.current=false;
            mapa.removeInteraction()
        }
    }
    function peticionArea(){
        var fechaIni = getFecha(new Date(), -40);
        var fechaFin = getFecha(new Date(), +500);
        /*var newGeo = {
            "geometry": geometria, "properties": {
                "crs": "http://www.opengis.net/def/crs/EPSG/0/3857"
            }
        }*/
        console.log(fechaIni,fechaFin)
        console.log(vector.getSource().getFeatures().getGeometry())
        /*fetch(`${serverUrl}/sentinelap/createSuscripcionHumedadSuelo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'geometria': newGeo, 'fechaini': fechaIni, 'fechafin': fechaFin })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                } else {
                    console.log(data.error);
                }
            })*/
    }
    function capaIniciales() {
        if (getLayerText("Predios") == null) {
            var asignacion_roce = new Image({
                text: 'Predios',
                title: 'Predios',
                visible: true,
                baseLayer: false,
                preview: "limites.png",
                source: new ImageWMS({
                    url: "http://forestryai.cl:8000/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:fundos_bol_mer',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:900913'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            });
            var btn = new ButonOl({
                html: "<img src='layer.png' class='imgMapa'/>",
                title: 'capas',
                className: 'btnCapas',
                handleClick: function (e) {
                    setShowTree(!showTree);
                    /*if (!menu.isVisible()) {
                        menu.showAt([e.x + 20, 5]);
                        //this.setHtml("<img src='../cobrands/mininco/images/collapse.png'/>");
                    } else {
                        menu.setVisible(false);
                        //this.setHtml("<img src='../cobrands/mininco/images/layer.png'/>");
                    }*/
                },
            });
            var btnGeo = new ButonOl({
                html: "<img src='draw.png' class='imgMapa'/>",
                title: 'capas',
                className: 'btnDraw',
                handleClick: function(e){changeDraw()},
            });
            var btnSuscrip = new ButonOl({
                html: "<img src='draw.png' class='imgMapa'/>",
                title: 'capas',
                className: 'btnSuscription',
                handleClick: function(e){peticionArea()},
            });
            
            mapa.addLayer(asignacion_roce);
            //mapa.on('singleclick', eventoClickMapa);
            //mapa.on('pointermove', eventoMoveMapa);
            mapa.addControl(btn);
            mapa.addControl(btnGeo);
            mapa.addControl(btnSuscrip);
            mapa.addControl(new LayerSwitcherImage({
                handleClick: function (event) {
                    console.log(event)
                }
            }));

            mapa.addLayer(vector);
            //vector.getSource().addFeature(new ol.Feature(new ol.geom.Polygon([[[34243, 6305749], [-288626, 5757848], [210354, 5576845], [34243, 6305749]]])));
            /*
            var select = new ol.interaction.Select();
            function setSelect(b) {
              select.setActive(b);
              draw.setActive(!b);
              drawhole.setActive(false);
            }
            map.addInteraction(select)
            */
            var draw = new Draw({
                source: vector.getSource(),
                type: 'Polygon'
            });
            //mapa.addInteraction(draw);
            var drawhole = new DrawHole({
                layers: [vector]
            });
            //drawhole.setActive(false);
            //mapa.addInteraction(drawhole);

            function toggle(active) {
                draw.setActive(!active);
                drawhole.setActive(active);
            }
            mapa.setTarget(refMapa.current)
        }
    }
    useEffect(() => {
        capaIniciales();
    }, [])
    return (
        <>
            <div ref={refMapa} className='mapContainerSlide' ></div>
        </>
    )
}

export default MapBaseSlider

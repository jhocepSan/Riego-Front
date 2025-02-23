import React, { useContext, useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import Draw from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay'
import VectorDraw from 'ol/source/Vector'
import { LineString, Polygon } from 'ol/geom.js';
import { getArea, getLength } from 'ol/sphere.js';
import { defaults as defaultControls } from 'ol/control.js';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import VectorLayer from 'ol/layer/Vector';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import XYZ from 'ol/source/XYZ.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import FileSaver from 'file-saver';
import { getFechaConvert, getDateFormat, getFecha, getMesAnio, getFechaConvertIso, getFechaNumerica, getFechaDMA } from '../Utils/DateConverter'
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css"
import { ContextAplications } from '../../App';
import TreeLayer from './TreeLayer';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import StadisticShow from './StadisticShow';
import * as proj from 'ol/proj';
import { serverUrl, decodeISO } from '../Utils/UtilsAplication';
import MsgUtils from '../Utils/MsgUtils';
import { Form, Collapse } from 'react-bootstrap';
import BusquedaPredio from '../Tools/BusquedaPredio';
import SliderFecha from '../Tools/SliderFecha'
import SliderBaseMap from '../Tools/SliderBaseMap';
import ButonOl from 'ol-ext/control/Button';
import * as olExtent from 'ol/extent';
import Stamen from 'ol/source/Stamen';
//import Polygon from 'ol/geom/Polygon'
import Swipe from 'ol-ext/control/Swipe'
import PrincipalLegend from './PrincipalLegend';
import MapaComparable from './MapaComparable.jsx';
import { permisoModulo } from '../Utils/ValidarPermiso';
import FieldIgualar from './FieldIgualar.jsx';
import ParametroSuscripcion from './ParametroSuscripcion.jsx';
import GeoConverter from '../Utils/GeoConverter.js';
import axios from 'axios';
import OpcionesDescarga from './OpcionesDescarga.jsx';
import OpcionesDescargaImages from './OpcionesDescargaImages.jsx';
import VistaCatastral from './VistaCatastral.jsx';
import PlanetApi from '../Sql/PlanetApi.js';
import BuscarPredio from './BuscarPredio.jsx';
const tipoWms = [
    {
        'id': '1_TRUE-COLOR', 'nombre': 'TRUE COLOR', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'S', 'std': false, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': false, "rangocolores": []
    },
    {
        'id': '2_FALSE-COLOR', 'nombre': 'FALSE COLOR', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'S', 'std': false, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': false, "rangocolores": []
    },
    {
        'id': '3_NDVI', 'nombre': 'NDVI', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'P', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': true,
        "rangocolores": [[1, '007011'], [0.7, '038516'], [0.5, '5c9300'], [0.3, 'b6b626'], [0.1, 'ebe2ac'], [-1, 'fffdea']]
    },
    {
        'id': '4_NDWI', 'nombre': 'NDWI', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'P', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': true, "rangocolores": [[1, '08306b'], [0.9, '3ea7fa'], [0, '7fc4fa'], [-1, 'f7fbff']]
    },
    {
        'id': '9_EVI', 'nombre': 'EVI', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'P', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': true, "rangocolores": [[1, '004400'], [0.6, '0f540a'], [0.55, '216011'], [0.5, '306d1c'],
        [0.45, '3f7c23'], [0.4, '4f892d'], [0.35, '609635'], [0.3, '70a33f'], [0.25, '7fb247'], [0.2, '91bf51'], [0.175, 'a3cc59'], [0.15, 'afc160'], [0.125, 'bcb76b'],
        [0.1, 'ccc682'], [0.075, 'ddd89b'], [0.05, 'ede8b5'], [0.025, 'fff9cc'], [0, 'eaeaea'], [-0.1, 'dbdbdb'], [-0.2, 'bfbfbf'], [-0.5, '0c0c0c']]
    },
    {
        'id': '10_SAVI', 'nombre': 'SAVI', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'P', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': false, "rangocolores": [[1, '004400'], [0.6, '0f540a'], [0.55, '216011'], [0.5, '306d1c'],
        [0.45, '3f7c23'], [0.4, '4f892d'], [0.35, '609635'], [0.3, '70a33f'], [0.25, '7fb247'], [0.2, '91bf51'], [0.175, 'a3cc59'], [0.15, 'afc160'], [0.125, 'bcb76b'],
        [0.1, 'ccc682'], [0.075, 'ddd89b'], [0.05, 'ede8b5'], [0.025, 'fff9cc'], [0, 'eaeaea'], [-0.1, 'dbdbdb'], [-0.2, 'bfbfbf'], [-0.5, '0c0c0c']]
    },
    {
        'id': '6_MSAVI2', 'nombre': 'MSAVI2', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'S', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': true, "rangocolores": []
    },
    {
        'id': '7_MTVI2', 'nombre': 'MTVI2', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'S', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': false, "rangocolores": []
    },
    {
        'id': '8_TGI', 'nombre': 'TGI', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'S', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': false, "rangocolores": []
    },
    {
        'id': '5_VARI', 'nombre': 'VARI', 'idColection': 'cb8c3c95-4e41-4627-a380-01d4b8467621', "tipo": 'S', 'std': true, "fecha": true,
        'idVisual': 'ba574da1-c306-4510-8d57-00ba98e8d52f', 'histo': true, "rangocolores": []
    }]
const saloWms = [
    {
        'id': 'SWC', 'nombre': 'CONTENIDO AGUA EN EL SUELO', 'idColection': '3af9a995-c7e0-4e82-8b1c-a6db5191bd2f', "tipo": 'A', 'std': true,
        "fecha": true, 'capaUPF': 'cite:fundos_riego', 'capaUTB': 'cite:ri_utbs_riego', 'histo': true, "histog": true,
        "rangocolores": [[1.0, '003492'], [0.95, '00478f'], [0.9, '00558d'], [0.85, '00618c'], [0.8, '006d8a'], [0.75, '007788'], [0.7, '008186'], [0.65, '008a85'], [0.6, '009383'], [0.55, '269c83'], [0.5, '4da484'], [0.45, '68ac86'], [0.4, '80b48a'], [0.35, '96bc90'], [0.3, 'aac398'], [0.25, 'bdcba3'], [0.2, 'ced3af'], [0.15, 'dedcbd'], [0.1, 'ede4cb'], [0.05, 'faedda'], [0.0, 'fff7ea'], [-5, 'faf6f0']]
    },
    {
        'id': 'TEMP', 'nombre': 'TEMPERATURA DE LA SUPERFICIE', 'idColection': '3af9a995-c7e0-4e82-8b1c-a6db5191bd2f', "tipo": 'A', 'std': true,
        "fecha": true, 'capaUPF': 'cite:upfs_temperatura', 'capaUTB': 'cite:utbs_temperatura', 'histo': true, "histog": true,
        "rangocolores": [[1.0, '003492'], [0.95, '00478f'], [0.9, '00558d'], [0.85, '00618c'], [0.8, '006d8a'], [0.75, '007788'], [0.7, '008186'], [0.65, '008a85'], [0.6, '009383'], [0.55, '269c83'], [0.5, '4da484'], [0.45, '68ac86'], [0.4, '80b48a'], [0.35, '96bc90'], [0.3, 'aac398'], [0.25, 'bdcba3'], [0.2, 'ced3af'], [0.15, 'dedcbd'], [0.1, 'ede4cb'], [0.05, 'faedda'], [0.0, 'fff7ea'], [-5, 'faf6f0']]
    }]
const timeSolar = [{ 'id': 'TEMP', 'nombre': 'Medio Dia' }, { 'id': 'TEMP2', 'nombre': 'Media Noche' }]
const baseVariPla = [
    { 'id': '&proc=rgb', 'nombre': 'RGB' },
    { 'id': '&proc=cir', 'nombre': 'CIR' },
    { 'id': '&proc=ndvi', 'nombre': 'NDVI' },
    { 'id': '&proc=ndwi', 'nombre': 'NWDI' },
    { 'id': '&proc=vari', 'nombre': 'VARI' },
    { 'id': '&proc=msavi2', 'nombre': 'MSAVI2' },
    { 'id': '&proc=mtvi2', 'nombre': 'MTVI2' },
    { 'id': '&proc=tgi', 'nombre': 'TGI' },
]
const listaDeforestada = [{ 'id': 1, 'nombre': 'Defo1', 'periodo': 'Enero-Febrero' },
{ 'id': 2, 'nombre': 'Defo2', 'periodo': 'Febrero-Marzo' },
{ 'id': 3, 'nombre': 'Defo3', 'periodo': 'Marzo-Abril' },
{ 'id': 4, 'nombre': 'Defo4', 'periodo': 'Abril-Mayo' },
{ 'id': 5, 'nombre': 'Defo5', 'periodo': 'Mayo-Junio' },
{ 'id': 6, 'nombre': 'Defo6', 'periodo': 'Junio-Julio' },
{ 'id': 7, 'nombre': 'Defo7', 'periodo': 'Julio-Agosto' },
{ 'id': 8, 'nombre': 'Defo8', 'periodo': 'Agosto-Septiembre' }
]
const filtrosCapas = [{ 'id': 1, 'nombre': 'UPF', 'capa': 'Predios', 'capaselc': 'seleccion' },
{ 'id': 2, 'nombre': 'Paños', 'capa': 'panio', 'capaselc': 'seleccionA' },
{ 'id': 3, 'nombre': 'UTBs', 'capa': 'utb', 'capaselc': 'seleccionB' }]
const fechasSalo = ["2022-12-31T20:00:00+00:00", "2021-12-31T20:00:00+00:00", "2020-12-31T20:00:00+00:00", "2019-12-31T20:00:00+00:00", "2018-12-31T20:00:00+00:00", "2017-12-31T20:00:00+00:00", "2016-12-31T20:00:00+00:00", "2015-12-31T20:00:00+00:00", "2014-12-31T20:00:00+00:00", "2013-12-31T20:00:00+00:00", "2012-12-31T20:00:00+00:00"];
const anios = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']
const filtroPrediosRiego = [{ 'id': 1, 'nombre': 'RIEGO ETAPA 1' }, { 'id': 2, 'nombre': 'RIEGO ETAPA 2' }, { 'id': 3, 'nombre': 'RIEGO ETAPA 3' }, { 'id': 4, 'nombre': 'RIEGO ETAPA 4' }, { 'id': 5, 'nombre': 'RIEGO ETAPA 5' }, { 'id': 6, 'nombre': 'RIEGO ETAPA 6' }]
function MapContainer() {
    const refMapa = useRef();
    const { loading, setLoading, datosUser, tipoPagina } = useContext(ContextAplications);
    const [maxDias, setMaxDias] = useState(0);
    const [collection, setCollection] = useState({});
    const [geometria, setGeometria] = useState({});
    const [infoPredio, setInfoPredio] = useState(null);
    const [infoPredioDe, setInfoPredioDe] = useState(null);
    const [showTree, setShowTree] = useState(false);
    const [tipoLayer, setTipoLayer] = useState('');
    const [numDia, setNumDia] = useState(0);
    const [fechas, setFechas] = useState([]);
    const [fechaHum, setFechasHum] = useState([]);
    const [sliderMap, setSliderMap] = useState([]);
    const [mapa, setMapa] = useState(new Map({
        layers: [
            new TileLayer({
                text: "OSM",
                title: "OSM",
                legendUrl: 'osm.png',
                baseLayer: true,
                visible: false,
                source: new OSM(),
            }),
            /*new TileLayer({
                text: "Blanco Negro",
                title: "Blanco Negro",
                visible: false,
                baseLayer: true,
                source: new XYZ({
                    //url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                    //url:'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    //url:'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
                    //url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{Layer}/{TileMatrixSet}/{z}/{y}/{x}.png',
                    url:'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
                    crossOrigin: 'anonymous', // Permitir CORS
                  })
                /*source: new Stamen({
                    layer: 'toner-lite',
                    crossOrigin: 'anonymous'
                }),
            }), */
            new TileLayer({
                text: "Satelital",
                title: "Satelital",
                legendUrl: 'sateliteColor.png',
                visible: false,
                baseLayer: true,
                source: new XYZ({
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    maxZoom: 49
                })
            }),
            /*new TileLayer({
                text: "Mapa HD",
                title: "Mapa HD",
                visible: false,
                legendUrl: 'ortofoto.png',
                baseLayer: true,
                source: new XYZ({
                    url: 'https://earthtodate.com/v2/tci/{z}/{x}/{y}?end_date=2024-01-01&days_back=365&max_clouds=10'
                    //url: 'https://earthtodate.com/v1/tile/{z}/{x}/{y}?end_date=2024-01-01&days_back=365&max_clouds=10',
                })
            }),
            new TileLayer({
                text: "Mapa Base",
                title: "Mapa Base",
                legendUrl: 'ortofoto.png',
                visible: false,
                baseLayer: true,
                source: new XYZ({
                    url: 'https://tiles.planet.com/basemaps/v1/planet-tiles/planet_medres_normalized_analytic_2024-03_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAKd8e479b1e5a44d7d802c107a841c6329'
                })
            }),*/
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
            })
        ],
        view: new View({
            center: [-8031505.1551455455, -4390012.115152867],
            zoom: 8,
            //maxZoom: 22,
            //minZoom: 0,
        })
    }));
    const [stadistic, setStadistic] = useState([]);
    const [selectFeature, setSelectFeature] = useState(false);
    const [viewP, setViewP] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalDe, setShowModalDe] = useState(false);
    const [tipoModal, setTipoModal] = useState('');
    const [tituloModal, setTituloModal] = useState('');
    const [gesionMap, setGestionMap] = useState([]);
    const [selectGestion, setSelectGestion] = useState('');
    const [showMapaBase, setShowMapaBase] = useState(false);
    const [tipoPredio, setTipoPredio] = useState('');
    const [esSalo, setEsSalo] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const [actiSwip, setActiSwip] = useState(false);
    const [predioDer, setPredioDer] = useState('');
    const [predioIz, setPredioIz] = useState('');
    const [tipoBaseMapa, setTipoBaseMapa] = useState('&proc=rgb');
    const [activarLegend, setActivarLegend] = useState(false);
    const [activarDraw, setActivarDraw] = useState(false);
    const [selectTipoPredio, setSelectTipoPredio] = useState(null);
    const [mostrarLeyenda, setMostrarLeyenda] = useState(false);
    const [showToolArea, setShowToolArea] = useState(false);
    const [activarDivisor, setActivarDivisor] = useState(false);
    const [showAreasInra, setShowAreasInra] = useState(false);
    const [medirTools, setMedirTools] = useState('');
    const [listaCaminos, setListaCaminos] = useState([]);
    const [poligonosCamino, setPoligonosCamino] = useState([]);
    const [predioCaminoSe, setPredioCaminoSe] = useState(null);
    const [geometriaCamino, setGeometriaCamino] = useState(null);
    const [viewVentana, setViewVentana] = useState(false);
    const [fieldCapaNueva, setFieldCapaNueva] = useState([]);
    const [fieldTablaCapa, setFieldTablaCapa] = useState([]);
    const [featuresNuevos, setFeaturesNuevos] = useState({});
    const [infoAreainra, setInfoAreainra] = useState([]);
    const [indexCarousel, setIndexCarousel] = useState(0);
    const [listaSuscripciones, setListaSuscripciones] = useState([]);
    const [listaAreasTrabajadas, setListaAreasTrabajadas] = useState([]);
    const [infoDefo, setInfoDefo] = useState(null);
    const [anioHD, setAnioHD] = useState('2024');
    const [tipoGeometria, setTipoGeomatria] = useState(null);
    const [infoMapa, setInfoMapa] = useState(false);
    const [auxFechas, setAuxFechas] = useState([]);
    const [listaGestiones, setListaGestiones] = useState([]);
    const [filtroFundoRiego, setFiltroFundoRiego] = useState('RIEGO ETAPA 1');
    const [filtroRiegoGestion, setFiltroRiegoGestion] = useState('RIEGOS TEMP 2024_2025');
    const [nivelCapa, setNivelCapa] = useState(1);
    const tipoActivado = useRef(null);
    const geometriaAux = useRef(null);
    const activeSwiper = useRef(false);
    const overlowCapaRef = useRef(null);
    const overloadFeatureSelect = useRef(null);
    const swipeRef = useRef(new Swipe());
    const mapRef = useRef();
    mapRef.current = mapa;
    const drawRef = useRef();
    const drawDistancia = useRef();
    const capaDistancia = useRef();
    const capaAuxiliarDis = useRef();
    const helpToolTip = useRef();
    const measureToolTip = useRef();
    const drawRefActive = useRef(false);
    /*function agregarNewCapa(capa, nombre, poligono, lado) {

        try {
            var fechaI = getFechaConvert(fechas[numDia], 0);
            var fechaF = getFechaConvert(fechas[numDia], 10);
            if (getLayerText(nombre) == null) {
                var imge = new TileLayer({
                    text: nombre,
                    title: 'Indice Espectral',
                    visible: true,
                    baseLayer: false,
                    source: new TileWMS({
                        url: "https://services.sentinel-hub.com/ogc/wms/ba574da1-c306-4510-8d57-00ba98e8d52f",
                        params: {
                            "layers": capa,
                            "time": fechaI + "/" + fechaF,
                            "GEOMETRY": poligono
                        },
                        serverType: 'geoserver',
                        transition: 0
                    })
                })
                mapa.addLayer(imge);
                if (lado != '') {
                    if (lado == 'R') {
                        swipeRef.current.addLayer(imge, true)
                    } else if (lado == 'L') {
                        swipeRef.current.addLayer(imge)
                    }
                }
            } else {
                mapa.getLayers().forEach(function (layer) {
                    if (layer instanceof TileLayer) {
                        if (layer.values_.text == nombre) {
                            layer.getSource().updateParams({ "layers": capa })
                            layer.setVisible(true);
                            if (lado != '') {
                                if (lado == 'R') {
                                    swipeRef.current.addLayer(layer, true)
                                } else if (lado == 'L') {
                                    swipeRef.current.addLayer(layer)
                                }
                            }
                        }
                    }
                })
            }
            mapa.changed();
        } catch (error) {
            mapa.getView().setCenter([-6988263, -1940221])
            mapa.getView().setZoom(12);
            MsgUtils.msgAdvertencia("Seleccione nuevamente el predio, por favor.")
        }
    }
    function obtenerWmsAguaSuelo(capa, nombre, poligono) {
        if (getLayerText(nombre) == null) {
            var imge = new TileLayer({
                text: nombre,
                title: nombre,
                visible: true,
                baseLayer: false,
                source: new TileWMS({
                    url: "https://services.sentinel-hub.com/ogc/wms/c74e116b-b8bc-499d-abd1-2d1b615f74cf",
                    params: {
                        "layers": 'SWC-DISPLAY',
                        "time": '2024-06-21' + "/" + "2024-06-23",
                        "GEOMETRY": poligono
                    },
                    serverType: 'geoserver',
                    transition: 0
                })
            })
            var layerCapa = getLayerText('Predios')
            mapa.removeLayer(layerCapa);
            mapa.addLayer(imge);
            mapa.addLayer(layerCapa);
        } else {
            mapa.getLayers().forEach(function (layer) {
                if (layer instanceof TileLayer) {
                    if (layer.values_.text == nombre) {
                        layer.getSource().updateParams({ "layers": 'SWC-DISPLAY' })
                        layer.setVisible(true);
                    }
                }
            })
        }
        mapa.changed();
    }
    function obtenerWmsSalo(capa, nombre, poligono, lado) {
        if (getLayerText(nombre) == null) {
            var imge = new TileLayer({
                text: nombre,
                title: 'Indice Forestal',
                visible: true,
                baseLayer: false,
                source: new TileWMS({
                    url: "https://services.sentinel-hub.com/ogc/wms/c74e116b-b8bc-499d-abd1-2d1b615f74cf",
                    params: {
                        "layers": capa,
                        "time": '2021-12-31' + "/" + "2024-10-23",
                        "GEOMETRY": poligono
                    },
                    serverType: 'geoserver',
                    transition: 0
                })
            })
            var layerCapa = getLayerText('Predios');
            var layerCapaSalo = getLayerText('PrediosSALO');
            var layerDeforestacion = getLayerText('Deforestacion');
            mapa.removeLayer(layerCapaSalo);
            mapa.removeLayer(layerCapa);
            mapa.removeLayer(layerDeforestacion);
            mapa.addLayer(imge);
            mapa.addLayer(layerCapa);
            mapa.addLayer(layerCapaSalo);
            mapa.addLayer(layerDeforestacion);
            layerCapa.setVisible(false);
            layerCapaSalo.setVisible(true);
            if (lado == 'R') {
                swipeRef.current.addLayer(imge, true)
            } else if (lado == 'L') {
                swipeRef.current.addLayer(imge)
            }
        } else {
            mapa.getLayers().forEach(function (layer) {
                if (layer instanceof TileLayer) {
                    if (layer.values_.text == nombre) {
                        layer.getSource().updateParams({ "layers": capa })
                        layer.setVisible(true);
                        if (lado == 'R') {
                            swipeRef.current.addLayer(layer, true)
                        } else if (lado == 'L') {
                            swipeRef.current.addLayer(layer)
                        }
                    }
                }
            })
            var layerCapa = getLayerText('Predios');
            var layerCapaSalo = getLayerText('PrediosSALO');
            layerCapa.setVisible(false);
            layerCapaSalo.setVisible(true);
        }
        mapa.changed();
    }*/
    function modificarUrl(fecha, laye) {
        mapa.getLayers().forEach(function (layer) {
            if (layer instanceof TileLayer) {
                if (layer.values_.text == laye) {
                    layer.getSource().updateParams({ "LAYERS": fecha })
                }
            } else if (layer instanceof Image) {
                if (layer.values_.text == laye) {

                    layer.getSource().updateParams({ "LAYERS": fecha })
                }
            }
        })
        mapa.changed();
        setLoading(false);
    }
    function getLayerText(nombre) {
        var laye = null;
        mapRef.current.getLayers().forEach(function (layer) {
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
    function obtenerWms(capa, nombre, lado) {
        if (capa.id == 'SWC' || capa.id == 'TEMP') {
            var fecha = fechaHum[numDia]
            activarCapaInicial(capa, fecha, nombre, lado)
        }
    }
    function obtenerFechasAgua(fechaFin, fechaIni, predio) {

        var fechaInif = new Date().getTime();
        var geometrias = { 'geometry': { 'type': 'MultiPolygon', 'coordinates': [[[-6863529.745634918, -2030909.471264263], [-6863506.133981666, -2030390.0148927118], [-6863033.900916619, -2030295.5682797024], [-6863033.900916619, -2030791.4129980013], [-6863529.745634918, -2030909.471264263]]] } }
        fetch(`${serverUrl}/sentinelap/getInfoStadisticPredio`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'geometry': geometrias, 'tipoPredio': predio.id,
                'fechaIni': fechaIni, 'fechaFin': fechaFin, 'id': predio.idColection, 'periodo': 'P1D'
            })
        })
            .then((res) => res.json())
            .then(data => {
                setLoading(false);
                if (data.ok) {
                    var infor = data.ok.data.filter(item => item.outputs.index.bands.B0.stats.min != 'NaN');
                    setNumDia(infor.length - 1);
                    setAuxFechas(infor.map(item => item.interval))
                    setFechasHum(infor.map(item => item.interval.from));
                    var fechaFin = new Date().getTime();

                } else {

                    MsgUtils.msgError(data.error);
                }
            })
    }
    function obtenerWmsInicial(dato, nombre, geometri, dateFecha) {

        var geo = "POLYGON (("
        for (var i of geometri.coordinates[0][0]) {
            geo += i[0] + " " + i[1] + ","
        }
        var geometry = geo.slice(0, geo.length - 1);
        geometry += "))"
        if (nombre == 'sentinel') {
            agregarNewCapaInicial(dato, nombre, geometry, dateFecha);
        } else {
            agregarNewCapaInicialHumedad(dato, nombre, geometry, dateFecha);
        }
    }
    function agregarNewCapaInicial(capa, nombre, poligono, dateFecha) {
        var fechaI = getFechaConvert(dateFecha[numDia], 0);
        var fechaF = getFechaConvert(dateFecha[numDia], 10);
        var imge = new TileLayer({
            text: nombre,
            title: 'Indice Espectral',
            visible: true,
            baseLayer: false,
            source: new TileWMS({//a5cc1a27-8c27-4475-8a35-40e0edc7d283
                url: "https://services.sentinel-hub.com/ogc/wms/ba574da1-c306-4510-8d57-00ba98e8d52f",
                params: {
                    "layers": capa,
                    "time": fechaI + "/" + fechaF,
                    "GEOMETRY": poligono
                },
                serverType: 'geoserver',
                transition: 0
            })
        })
        mapa.addLayer(imge);
    }
    function obtenerWmsDate(valor) {
        setNumDia(valor);
        if (esSalo == false) {
            var fechaa = getFechaConvert(fechas[valor], 0)
            var fechaf = getFechaConvert(fechas[valor], 10)
            modificarUrl(fechaa + "/" + fechaf, 'sentinel');
        } else {
            var fechaa = auxFechas[valor];
            var fechaNumerica=''
            if (tipoPredio =='TEMP') {
                fechaNumerica = 'cite:' + getFechaNumerica(fechaa.fecha, 0) + '_1330_tem'
            } else if(tipoPredio =='TEMP2'){
                fechaNumerica = 'cite:' + getFechaNumerica(fechaa.fecha, 0) + '_0130_tem'
            }else if(tipoPredio == 'SWC') {
                fechaNumerica = 'cite:' + getFechaNumerica(fechaa.fecha, 0) + '_swc'
            }
            modificarUrl(fechaNumerica, 'Ortofoto');
        }
    }
    function nuevaSuscription(geometry) {
        var fechaFin = getFechaConvert(new Date(), 0)
        var fechaIni = getFechaConvert(new Date(), -30)
        fetch(`${serverUrl}/planetap/createSuscription`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ fechaIni, fechaFin, geometry })
        }).then((res) => res.json())
        //.then(data => { 
        //.catch(error => 
    }
    function obtenerInfoCollectionS(id, tipo) {
        if (tipo == 'A') {
            var geomeHum = { "type": "MultiPolygon", "coordinates": [[[[-7148469.515350720845163, -1936782.795711112441495], [-7154178.379209967330098, -1928296.646731151035056], [-7144149.294051831588149, -1922433.48925408674404], [-7136434.613160957582295, -1931228.225469683296978], [-7140137.659988576546311, -1939868.668067462043837], [-7148469.515350720845163, -1936782.795711112441495]]]] }
            getInfContenidoFecha(geomeHum, id, tipo);
        } else {
            var geoSalo = { "type": "MultiPolygon", "coordinates": [[[[-7223147.626374380663037, -1894197.757193487603217], [-7145075.055758736096323, -1875219.64220193750225], [-7133657.328040242195129, -1923204.957343173911795], [-7177785.302736042067409, -1927370.88502424582839], [-7205558.153943188488483, -1912404.404095950303599], [-7206175.328414457850158, -1902683.906173449009657], [-7223147.626374380663037, -1894197.757193487603217]]]] }
            var geoSaloInra = { "type": "MultiPolygon", "coordinates": [[[[-7204763.486815666779876, -1784220.982679731678218], [-7205000.325067770667374, -1784198.232701035216451], [-7205048.39318766631186, -1783950.410284161334857], [-7204763.486815666779876, -1784220.982679731678218]]], [[[-7122709.414462408982217, -1811219.975046671461314], [-7132180.0943871922791, -1811117.323359419126064], [-7147072.624537350609899, -1815523.321557363495231], [-7149175.521723528392613, -1807864.900541214039549], [-7160206.123262622393668, -1802313.42520875367336], [-7173244.961272061802447, -1801561.887627289164811], [-7178215.477873572148383, -1804018.881926667876542], [-7172003.656882371753454, -1813202.75834823702462], [-7160499.00588336866349, -1822423.780547446804121], [-7147089.956823197193444, -1836112.546377172926441], [-7146966.35415071900934, -1836325.881329506170005], [-7118938.75315170455724, -1853207.577555295545608], [-7114757.743714022450149, -1859347.868372944183648], [-7106170.200702615082264, -1870113.713159857550636], [-7106012.458635746501386, -1877769.742875674506649], [-7124273.320155610330403, -1877300.248187492834404], [-7124236.775549297221005, -1870027.670849512098357], [-7140932.180594634264708, -1869933.556608007987961], [-7142484.645952464081347, -1880477.353818137431517], [-7144049.158968422561884, -1892975.340323478914797], [-7140296.442400722764432, -1903508.901072219479829], [-7136663.950492586940527, -1908106.914571646600962], [-7136113.416990032419562, -1911262.465007793391123], [-7135849.552755366079509, -1917128.648788003250957], [-7135782.349214322865009, -1921227.774812257383019], [-7197703.561198700219393, -1920934.169481728458777], [-7199642.915730559267104, -1917412.277217625640333], [-7202580.127479808405042, -1912555.191357379546389], [-7201686.798846163786948, -1906569.833204784896225], [-7204631.498033103533089, -1901872.152503195451573], [-7209239.743553085252643, -1899671.082024697214365], [-7210732.766906872391701, -1895395.164908018196002], [-7204667.944644817151129, -1886861.137611167738214], [-7202800.027635792270303, -1881542.520229190587997], [-7202406.827007537707686, -1868942.641306678997353], [-7199422.360731273889542, -1859511.43557829130441], [-7197484.367646780796349, -1848442.015920699341223], [-7197448.861593378707767, -1848273.770035525318235], [-7197442.905761766247451, -1848245.54806594341062], [-7196873.462107283063233, -1845546.967874302528799], [-7194031.247170365415514, -1841643.597783168079332], [-7193827.738408351317048, -1836819.932588599156588], [-7197275.93851706199348, -1830684.028693427564576], [-7198120.024402676150203, -1820210.150053756777197], [-7196146.329565952531993, -1816512.933303261641413], [-7199339.806779745034873, -1811489.854288402246311], [-7205068.734940779395401, -1781999.211405116831884], [-7056589.887938691303134, -1791789.186601009685546], [-7049766.956796658225358, -1791733.116213322849944], [-7058763.656227766536176, -1777547.011006370419636], [-7060728.235954933799803, -1770018.641469843452796], [-7069066.088288655504584, -1762257.000949495239183], [-7084432.420335911214352, -1755138.262776547810063], [-7088161.966059904545546, -1753136.635520577896386], [-7087522.782497899606824, -1748191.334866251330823], [-7066661.404290452599525, -1747564.177557641873136], [-7044430.353680691681802, -1750802.789327342994511], [-7030808.844310876913369, -1752806.876460172934458], [-7024220.091106881387532, -1760551.313199003925547], [-7022245.986130868084729, -1771614.228718368569389], [-7016749.165133343078196, -1779140.849163208622485], [-7005087.330857813358307, -1786224.374403070425615], [-6988357.593619888648391, -1791527.37855953280814], [-6988978.970546963624656, -1828987.176262197084725], [-6987643.146494785323739, -1840745.620012994389981], [-6999111.686412232927978, -1842753.223729978548363], [-7007935.238897949457169, -1843422.877958453260362], [-7013229.644886983558536, -1848529.315141791244969], [-7023599.926961475051939, -1848082.845950490795076], [-7034853.389168272726238, -1848740.834856844041497], [-7045669.624128469265997, -1851836.226726638153195], [-7048332.240362301468849, -1861160.057593192905188], [-7051522.859618192538619, -1869097.200547789921984], [-7054298.733183615840971, -1864315.509169498924166], [-7058488.331560445018113, -1862910.547715832013637], [-7063047.492709184996784, -1851637.768330140737817], [-7068259.505255875177681, -1847608.243245837278664], [-7071899.572896719910204, -1840017.695580551400781], [-7085983.307118787430227, -1829992.253046180820093], [-7093677.451916278339922, -1823755.986816332442686], [-7114987.963074499741197, -1818724.43399790301919], [-7122709.414462408982217, -1811219.975046671461314]]]] }
            getInfContenidoFecha(geoSaloInra, id, tipo);
        }
    }
    function getInfContenidoFecha(geometry, id, tipo) {
        setLoading(true);
        setNumDia(fechasSalo.length - 1);
        setFechasHum(fechasSalo.reverse());
        setLoading(false);
    }
    function obtenerFecha(tipo) {
        if (tipoPredio != 'SWC') {
            if (tipo == 'S') {
                var fechaI = fechaHum[fechaHum.length - 1]
                var fechaF = getFechaConvertIso(fechaHum[fechaHum.length - 1], 15).substring(0, 10);

                setFechasHum([]);
                setAuxFechas(null);
                setLoading(true);
                obtenerFechas(selectTipoPredio, fechaI, fechaF);
            } else {
                var fechaF = fechaHum[0]
                var fechaI = getFechaConvertIso(fechaHum[0], -15).substring(0, 10);

                setFechasHum([]);
                setAuxFechas(null);
                setLoading(true);
                obtenerFechas(selectTipoPredio, fechaI, fechaF);
            }
        } else {

            if (tipo == 'S') {
                var fechaI = fechaHum[fechaHum.length - 1]
                var fechaF = getFechaConvertIso(fechaHum[fechaHum.length - 1], 40).substring(0, 10);

                setFechasHum([]);
                setAuxFechas(null);
                setLoading(true);
                obtenerFechas(selectTipoPredio, fechaI, fechaF);
            } else {
                var fechaF = fechaHum[0]
                var fechaI = getFechaConvertIso(fechaHum[0], -40).substring(0, 10);

                setFechasHum([]);
                setAuxFechas(null);
                setLoading(true);
                obtenerFechas(selectTipoPredio, fechaI, fechaF);
            }
        }
    }
    function obtenerImagenWms(geometria, tipo, fechaI, fechaF) {

        fetch(`${serverUrl}/sentinelap/getInfoPredio`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ geometria, 'id': 'cb8c3c95-4e41-4627-a380-01d4b8467621', fechaI, fechaF })
        })
            .then((res) => res.json())
            .then(data => {

                if (data.ok) {
                    if (data.ok.length != 0) {
                        setSelectFeature(true);
                        var listaFiltrada = [...new Set(data.ok.map(item => new Date(item).toISOString().substring(0, 10)))];
                        setNumDia(listaFiltrada.length - 1);
                        setFechas(listaFiltrada.reverse());
                        setMaxDias(listaFiltrada.length - 1);
                        setTipoLayer('');
                        if (getLayerText('sentinel') != null) {
                            mapa.removeLayer(getLayerText('sentinel'))
                        }
                        setTipoLayer('rgb');
                        setEsSalo(false)
                        if (tipoPredio == '') {
                            setTipoPredio('1_TRUE-COLOR');
                            obtenerWmsInicial('1_TRUE-COLOR', 'sentinel', geometria, data.ok);
                        } else {
                            obtenerWmsInicial(tipoPredio, 'sentinel', geometria, data.ok);
                        }
                    } else {
                        setSelectFeature(true);
                        setEsSalo(false);
                        setTipoModal('I'); setTituloModal('Información Predio'); setShowModal(true);
                        setFechas([]);
                        MsgUtils.msgAdvertencia("Estos Predios no tienen IMAGEN");
                        //document.getElementById('btnShowInfo').click();
                    }
                } else {
                    setSelectFeature(false);
                    setFechas([]);
                    setGeometria({});
                    setStadistic({});
                    setMaxDias(0);
                    setTipoPredio('');
                    MsgUtils.msgError(data.error)
                }
                setLoading(false);
            })
    }
    function getInfoAreaDeforestada() {
        fetch(`${serverUrl}/usuario/getAreaDeforestacion`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'geometrias': geometriaAux.current, 'tipoPredio': tipoActivado.current })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.ok) {

                    var lista = JSON.parse(data.ok).map(item => parseFloat(item.area));
                    let total = lista.reduce((a, b) => a + b, 0);
                    setInfoDefo({ 'data': JSON.parse(data.ok), 'areaTotal': total });
                } else {
                    setInfoDefo(null)
                    MsgUtils.msgError(data.error);
                }
            })
    }
    const obtenerFechas = async (tipo, fechaIni, fechaFin) => {
        var parametros = {
            "tipoPredio": tipo.id,
            "fechaIni": fechaIni,
            "fechaFin": fechaFin
        }
        var resultado = await PlanetApi.getFechasImagen(parametros)
        if (resultado.ok) {

            setAuxFechas(resultado.ok)
            setFechasHum(resultado.ok.map(item => item.fecha));
            setNumDia(resultado.ok.length - 1);
            activarCapaInicial(tipo, resultado.ok[resultado.ok.length - 1].fecha, 'Ortofoto', '')
        }
    }
    const eventoClickMapa = (evt) => {

        if (drawRefActive.current == false) {
            const viewResolution = /** @type {number} */ (mapRef.current.getView().getResolution());
            var capaNivel = filtrosCapas.filter((item) => item.id == document.getElementById('selectNivelCapa').value)[0];

            const url = getLayerText(capaNivel.capa).getSource().getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857',
                { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 1 }
            );
            const urlRiego = getLayerText('controlriego').getSource().getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857',
                { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 1 }
            );
            if (url && getLayerText(capaNivel.capa).getVisible() == true) {
                setLoading(true);
                fetch(url)
                    .then((res) => res.json())
                    .then(data => {
                        console.log(data)
                        if (data.features.length != 0) {
                            var features = new VectorDraw({
                                features: new GeoJSON().readFeatures(data, {
                                    dataProjection: data.crs.properties.name,
                                    featureProjection: mapa.getView().getProjection()
                                })
                            })
                            //mapa.getView().setZoom(14);
                            mapa.getView().setCenter(olExtent.getCenter(features.getExtent()));
                            mapa.getView().fit(features.getExtent(), { duration: 1000 })
                            setInfoPredio(data.features[0].properties);
                            setGeometria(data.features[0].geometry);
                            geometriaAux.current = data.features[0].geometry;
                            if (tipoActivado.current != 'TEMP') {
                                setTipoPredio(saloWms[0].id);
                                setSelectTipoPredio(saloWms[0]);
                            }
                            setSelectFeature(true);
                            setTituloModal("Estadísticas " + saloWms[0].nombre + ' ' + filtroFundoRiego);
                            setEsSalo(true);
                            (tipoActivado.current == null) ? obtenerFechas(saloWms[0], '2024/11/01', '2024/12/19') : '';
                            var capa = getLayerText(capaNivel.capaselc);
                            capa.getSource().updateParams({ CQL_FILTER: "gid=" + data.features[0].properties.gid });
                            capa.setVisible(true);
                        } else {
                            setTipoGeomatria(null);

                            //MsgUtils.msgError("Realize el click en un predio, por favor !");
                            setLoading(false);
                        }
                    })
                    .catch(error => { MsgUtils.msgError(error.message); setLoading(false); })
                    .finally(() => { setLoading(false); }
                    );
            }
            /*if(urlRiego && getLayerText('controlriego').getVisible()==true){
                setLoading(true);
                fetch(url)
                    .then((res) => res.json())
                    .then(data => {
                        
                    })
                    .finally(()=>{setLoading(false);})
            }*/
        }
    }
    const eventoMoveMapa = (evt) => {
        var punto = proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
        document.getElementById('latitudMapa').innerHTML = 'lat: ' + punto[1].toFixed(4);
        document.getElementById('longitudMapa').innerHTML = ' long: ' + punto[0].toFixed(4);

        if (evt.dragging) {
            return;
        }
        const data = getLayerText('Predios').getData(evt.pixel);
        const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
        mapa.getTargetElement().style.cursor = hit ? 'pointer' : '';
        if (getLayerText('caminos') !== null && getLayerText('caminos').getVisible() == true) {
            const pixel = mapa.getEventPixel(evt.originalEvent);
            const feature = mapa.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });
            if (feature != overloadFeatureSelect.current) {
                if (overloadFeatureSelect.current) {
                    overlowCapaRef.current.getSource().removeFeature(overloadFeatureSelect.current);
                }
                if (feature) {
                    overlowCapaRef.current.getSource().addFeature(feature);

                }
                overloadFeatureSelect.current = feature;
            }
        }
    }
    const eventoMoveEnd = (evt) => {
        var zoom = mapa.getView().getZoom();
        document.getElementById('zoomMapa').innerHTML = 'ZOOM: ' + zoom.toFixed(2);
    }
    const obtenerInfoCollection = () => {
        fetch(`${serverUrl}/planetap/getBaseMapas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            }
        })
            .then((res) => res.json())
            .then(data => {
                if (data.ok) {

                    var listaBaseMap = data.ok.filter(item => item.name.includes('planet_medres_normalized_analytic'))
                    setSliderMap(listaBaseMap);
                    var valores = [...new Set(listaBaseMap.map(item => item.name.split('_')[4].split('-')[0]))]
                    setGestionMap(valores);
                    setSelectGestion(valores[valores.length - 1])
                } else {
                    MsgUtils.msgError(data.error);

                }
            })
        fetch(`${serverUrl}/usuario/fieldTabla`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'schema': 'public', 'nombre': 'fundos_bol_mer' })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.ok) {
                    setFieldTablaCapa(data.ok);
                } else {
                    MsgUtils.msgError(data.error);

                }
            })
        if (permisoModulo(2) == true) { }
        fetch(`${serverUrl}/predio/getGestionRiego`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            }
        })
            .then((res) => res.json())
            .then(data => {
                if (data.ok) {
                    setListaGestiones(data.ok.reverse());
                } else {
                    MsgUtils.msgError(data.error);

                }
            })
    }
    function descargarImagen(tipo, datFecha) {
        var poligono = null
        if (getLayerText('poligono') != null) {
            var layer = getLayerText('poligono');

            poligono = { "type": "MultiPolygon", "coordinates": [layer.getSource().getFeatures()[0].getGeometry().getCoordinates()] }
        } else if (getLayerText('newCapaUser') != null) {
            var layer = getLayerText('newCapaUser');

            poligono = { "type": "MultiPolygon", "coordinates": layer.getSource().getFeatures()[0].getGeometry().getCoordinates() }
        } else {
            poligono = geometria;
        }
        if (poligono != null ) {
            var nombreImg = '';
            if (tipo == 'V') {
                nombreImg = `${getFechaNumerica(fechaHum[numDia], 0)}_1330_tem.tif`;
            } else {
                nombreImg = `${getFechaNumerica(fechaHum[numDia], 0)}_a_1330_tem.tif`
            }
            axios.get(`${serverUrl}/document/Temperatura/${nombreImg}`, {
                responseType: 'blob'
            })
                .then(response => {
                    FileSaver.saveAs(response.data, `${nombreImg}`)
                })
                .catch(error => {
                    console.error('Error al realizar la solicitud:', error);
                });
            /*setLoading(true);
            var fechaI = '', fechaF = ''
            if (esSalo == false) {
                fechaI = getFechaConvert(datFecha == null ? fechas[numDia] : datFecha, 0);
                fechaF = getFecha(fechaI, 1).toISOString().substring(0, 10);
            } else {
                if (tipoPredio != 'Agua Suelo') {
                    fechaI = getFechaConvert(datFecha == null ? fechaHum[numDia] : datFecha, -365);
                    fechaF = getFechaConvert(datFecha == null ? fechaHum[numDia] : datFecha, 0);
                } else {
                    var fechaa = datFecha == null ? auxFechas[numDia] : datFecha;
            
                    fechaI = fechaa.from;
                    fechaF = fechaa.to;
                }
            }
            fechaI.replace(/-/g, '/')
            fechaF.replace(/-/g, '/')
            fetch(`${serverUrl}/sentinelap/descargarFotoPredio`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'geometria': poligono, 'tipo_predio': tipoPredio, 'fecha': fechaF, 'info': selectTipoPredio, 'tipoImg': tipo, 'fechaI': fechaI })
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        if (tipo == 'V') {
                            FileSaver.saveAs(`${serverUrl}/document/planetimg/${data.ok}`, `${fechaF}_${selectTipoPredio.nombre}.tiff`);
                        } else {
                            FileSaver.saveAs(`${serverUrl}/document/planetimg/${data.ok}`, `${fechaF}_${selectTipoPredio.nombre}.tiff`);
                        }
                        MsgUtils.msgCorrecto("Descarga Correcta...")
                    } else {
                
                        MsgUtils.msgError(data.error);
                    }
                    setLoading(false);
                }).catch((error) => {
                    MsgUtils.msgError(error);
                    setLoading(false);
                })*/
        } else {
            MsgUtils.msgAdvertencia("Para realizar la descarga se requiere dibujar, cargar o seleccionar un predio, por favor ...")
        }
    }
    function getGeometriaGeneral() {
        var poligono = null
        if (getLayerText('poligono') != null) {
            var layer = getLayerText('poligono');

            poligono = { "type": "MultiPolygon", "coordinates": [layer.getSource().getFeatures()[0].getGeometry().getCoordinates()] }
        } else if (getLayerText('newCapaUser') != null) {
            var layer = getLayerText('newCapaUser');


            poligono = { "type": layer.getSource().getFeatures()[0].getGeometry().getType(), "coordinates": layer.getSource().getFeatures()[0].getGeometry().getCoordinates() }
        } else {
            poligono = { geometria, 'infoPredio': infoPredio };//parseInt(Math.random() * 100) }//
        }
        return poligono;
    }
    function eventoSwipe() {
        if (activeSwiper.current == false) {
            activeSwiper.current = true;
            mapa.addControl(swipeRef.current);
            setActiSwip(true);
            activarCapaSwipe(true);
            document.getElementById('imgSwipe').src = 'disabled.png';
        } else {
            activarCapaSwipe(false);
            activeSwiper.current = false;
            setActiSwip(false);
            mapa.removeControl(swipeRef.current);
            document.getElementById('imgSwipe').src = 'swipe.png';
        }
    }
    const agregarCapaInicial = () => {
        if (getLayerText("Predios") == null) {
            var asignacion_roce = new Image({
                text: 'Predios',
                title: 'Predios',
                visible: true,
                baseLayer: false,
                preview: "limites.png",
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:fundos_riego',
                        CQL_FILTER: "c_dsc_faen='RIEGO ETAPA 1' and c_dsc_agru='RIEGOS TEMP 2024_2025'",
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
            var capaSeleccion = new Image({
                text: 'seleccion',
                title: 'seleccion',
                visible: false,
                baseLayer: false,
                preview: "limites.png",
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:fundos_riego_seleccion',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            var capaCultivos = new Image({
                text: 'Ortofoto',
                title: 'Ortofoto',
                visible: false,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:01112024_swc',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            var capaControlRiego = new Image({
                text: 'controlriego',
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
            })
            var capaTipoSuelo = new Image({
                text: 'tiposuelo',
                title: 'Tipo Suelo',
                visible: false,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:ri_tipo_suelo',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            var capaPanio = new Image({
                text: 'panio',
                title: 'Paño',
                visible: false,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:ri_panos_riego',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            var capaUtb = new Image({
                text: 'utb',
                title: 'UTB',
                visible: false,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:ri_utbs_riego',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
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
            })
            var capaSeleccionA = new Image({
                text: 'seleccionA',
                title: 'seleccionA',
                visible: false,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:ri_panos_riego_seleccion',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            var capaSeleccionB = new Image({
                text: 'seleccionB',
                title: 'seleccionB',
                visible: false,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': 'cite:ri_utbs_riego_seleccion',
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            var btn = new ButonOl({
                html: "<img src='layer.png' className='imgMapa' style='width:20'/>",
                title: 'capas',
                className: 'btnCapas',
                handleClick: function (e) {
                    setShowTree(!showTree);
                },
            });
            mapa.addLayer(capaCultivos);
            mapa.addLayer(asignacion_roce);
            mapa.addLayer(capaPanio);
            mapa.addLayer(capaUtb);
            mapa.addLayer(capaNiveles);
            mapa.addLayer(canalesRiego);
            mapa.addLayer(capaSeleccion);
            mapa.addLayer(capaSeleccionA);
            mapa.addLayer(capaSeleccionB);
            mapa.addLayer(capaControlRiego);
            mapa.addLayer(capaTipoSuelo);
            mapa.on('singleclick', eventoClickMapa);
            mapa.on('pointermove', eventoMoveMapa);
            mapa.on('moveend', eventoMoveEnd);
            mapa.addControl(btn);
            mapa.setTarget(refMapa.current)
        }
    }
    function cambiarVistaLayer(txt, valor) {
        if (txt == 'Mapa HD') {
            mapa.getView().setMaxZoom(18);
            //mapa.getView().setMinZoom(14);
        } else {
            mapa.getView().setMaxZoom(25);
            //mapa.getView().setMinZoom(8);
            if (txt == 'Mapa Base') {
                setShowMapaBase(valor);
            }
        }
        getLayerText(txt).setVisible(valor);
    }
    function getInfoCaminos() {
        fetch(`${serverUrl}/planetap/getAnaliticVectorial`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'id': '177888ad-ecd4-4470-95e7-a8349916dad5' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    var datosResultado = [...new Set(data.ok.features.map(item => item.properties.date))]
                    var datosObservado = [...new Set(data.ok.features.map(item => item.properties.observed))]
                    var cont = 0;
                    var listaRes = [];
                    for (var caminoObs of datosObservado) {
                        listaRes.push({ 'id': cont + 1, 'mesObs': getMesAnio(caminoObs), 'mesResu': getMesAnio(datosResultado[cont]), 'fechaObs': caminoObs, 'fechaRes': datosResultado[cont] })
                        cont += 1
                    }
                    setListaCaminos(listaRes);
                    setPoligonosCamino(data.ok.features);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(err => MsgUtils.msgError(err));
    }
    function mostrarPredio(valor) {
        setShowModal(false);
        mapa.getView().setCenter([valor.x, valor.y]);//proj.fromLonLat([valor.x, valor.y], 'EPSG:3857'));
        mapa.getView().setZoom(14);
    }
    function mostrarBaseMapL(valor) {
        var datos = []
        if (selectGestion == '') {
            datos = sliderMap
        } else {
            datos = sliderMap.filter((item) => item.name.split('_')[4].split('-')[0] == selectGestion)
        }
        var datoSelecc = datos[valor];
        mapa.getLayers().forEach(function (layer) {
            if (layer instanceof TileLayer) {
                if (layer.values_.text == 'Mapa Base') {
                    var url = datoSelecc._links.tiles + tipoBaseMapa;
                    layer.getSource().setUrl(url)
                }
                if (layer.values_.text == 'Mapa HD') {
                    var anio = datoSelecc.name.split('_')[4].split('-')
                    var url = `https://earthtodate.com/v2/tci/{z}/{x}/{y}?end_date=${parseInt(anio[0])}-${anio[1]}-01&max_clouds=10`
                    layer.getSource().setUrl(url)
                    setAnioHD(anio);
                }
            } else if (layer instanceof Image) {
                //listaAx.push(layer)
            }
        })
    }
    function cambiarTipoMapaBase(valor) {
        mapa.getLayers().forEach(function (layer) {
            if (layer instanceof TileLayer) {
                if (layer.values_.text == 'Mapa Base') {
                    var url = layer.getSource().getUrls()[0]
                    if (url.includes('&proc=')) {
                        url = url.substring(0, url.indexOf('&'))

                    }
                    layer.getSource().setUrl(url + valor);

                    setTipoBaseMapa(valor);
                }
            }
        })
    }
    function addMapSwipe(lado, tipoCapa, nombreCapa) {

        if (lado == 'R') {
            //setEsSalo(false);
            setPredioDer(tipoCapa);
            obtenerWms(tipoCapa, nombreCapa, lado);
        } else if (lado = 'L') {
            //setEsSalo(false);
            setPredioIz(tipoCapa);
            obtenerWms(tipoCapa, nombreCapa, lado);
        }
    }
    function activarCapaSwipe(val) {
        if (val == true) {
            if (esSalo == false) {
                if (tipoPredio == 'Mapa Base') {
                    var capaU = getLayerText('Mapa Base');
                    var capaD = getLayerText('Mapa HD');
                    capaD.setVisible(true);
                    swipeRef.current.addLayer(capaU, true);
                    swipeRef.current.addLayer(capaD);
                    mapa.getView().setZoom(14);
                    setMostrarLeyenda(true)
                } else if (['Defo1', 'Defo2', 'Defo3', 'Defo4', 'Defo5', 'Defo6', 'Defo7', 'Defo8', 'Defo9'].indexOf(tipoPredio) != -1) {
                    swipeRef.current.addLayer(getLayerText('Mapa Base'));
                    swipeRef.current.addLayer(getLayerText('Mapa Base L'), true);
                    getLayerText('Mapa Base L').setVisible(true);
                } else {
                    addMapSwipe('L', tipoPredio, 'sentinel')
                    addMapSwipe('R', tipoPredio, 'sentinelD')
                }
            } else {
                addMapSwipe('L', selectTipoPredio, 'Ortofoto')
                addMapSwipe('R', selectTipoPredio, 'OrtofotoD')
            }
        } else {
            var layer = getLayerText('sentinelD');
            if (layer != null) {
                mapa.removeLayer(layer);
            }
            layer = getLayerText('saloD');
            if (layer != null) {
                mapa.removeLayer(layer);
            }
            layer = getLayerText('OrtofotoD');
            if (layer != null) {
                mapa.removeLayer(layer);
            }
            setMostrarLeyenda(false);
            if (tipoPredio == 'Defo1' || tipoPredio == 'Defo2' || tipoPredio == 'Defo3' || tipoPredio == 'Defo4') {
                swipeRef.current.removeLayers()
                getLayerText('Mapa Base L').setVisible(false);
                //mapa.removeLayer(getLayerText('Mapa Base L'))
            }
        }
    }
    function activarLegenda() {
        if (activarLegend == false) {
            setActivarLegend(true);
            document.getElementById('imgLegend').src = 'disabled.png';
        } else {
            setActivarLegend(false);
            document.getElementById('imgLegend').src = 'legend.png';
        }
    }
    function activarDeforestacion(valor) {
        if (sliderMap.length != 0) {
            var capa = getLayerText('Deforestacion');
            if (getLayerText('Agua Suelo') != null) {
                getLayerText('Agua Suelo').setVisible(false);
            }
            if (getLayerText('salo') != null) {
                getLayerText('salo').setVisible(false);
            }
            if (getLayerText('PrediosSALO') != null) {
                getLayerText('PrediosSALO').setVisible(false);
            }
            if (getLayerText('caminos') != null) {
                getLayerText('caminos').setVisible(false);
            }
            getLayerText('Predios').setVisible(false);
            var mapas = sliderMap.filter((item) => {
                var fecha = item.name.split('_')[4].split('-')
                return fecha[0] == '2024' && (parseInt(fecha[1]) == valor || parseInt(fecha[1]) == (valor + 1))
            })
            if (getLayerText('Mapa Base') != null) {
                getLayerText('Mapa Base').setVisible(true);
                getLayerText('Mapa Base').getSource().setUrl(mapas[0]._links.tiles)
            }
            var mapasLift = getLayerText('Mapa Base L');
            if (mapasLift == null) {
                var layerDefo = getLayerText('Deforestacion');
                var layerPredioSalo = getLayerText('PrediosSALO');
                var layerPredio = getLayerText('Predios');
                mapa.removeLayer(layerDefo);
                mapa.removeLayer(layerPredioSalo);
                mapa.removeLayer(layerPredio);
                var imge = new TileLayer({
                    text: 'Mapa Base L',
                    title: 'Mapa Base L',
                    legendUrl: 'ortofoto.png',
                    visible: false,
                    baseLayer: true,
                    source: new XYZ({
                        url: mapas[1]._links.tiles
                    })
                })
                mapa.addLayer(imge);
                mapa.addLayer(layerDefo);
                mapa.addLayer(layerPredioSalo);
                mapa.addLayer(layerPredio);
            } else {
                getLayerText('Mapa Base L').getSource().setUrl(mapas[1]._links.tiles)
            }

            capa.getSource().updateParams({ CQL_FILTER: "mes=" + valor });
            capa.setVisible(true);
            mapa.getView().setCenter([-7052088.609715326, -1809628.9014307333])
        } else {
            MsgUtils.msgAdvertencia("Estamos cargando los mapa base intente nuevamente")
        }
    }
    const formatLength = function (line) {
        const length = getLength(line);
        let output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    };
    const formatArea = function (polygon) {
        const area = getArea(polygon);
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };
    function activarDrawPoligon() {
        if (activarDraw == false) {
            if (getLayerText('newCapaUser') != null) {
                mapa.removeLayer(getLayerText('newCapaUser'));
            }
            mapa.removeLayer(getLayerText('poligono'));
            setActivarDraw(true);
            const sourced = new VectorDraw({ wrapX: false });
            const vectordr = new VectorLayer({
                text: 'poligono',
                title: 'Draw Poligono',
                visible: true,
                baseLayer: false,
                source: sourced,
                style: {
                    'fill-color': 'rgba(255, 255, 255, 0.7)',
                    'stroke-color': '#8000FF',
                    'stroke-width': 2,
                    'circle-radius': 10,
                    'circle-fill-color': '#ffcc33',
                },
            });
            drawRef.current = new Draw({
                source: sourced,
                type: 'Polygon',
            });
            drawRefActive.current = true;
            drawRef.current.on('drawend', function () {
                //drawRefActive.current = false;
                //mapa.removeLayer(getLayerText('poligono'))
                mapa.removeInteraction(drawRef.current);
                //setActivarDraw(false);
                //document.getElementById('imgDrawPoligon').src = 'area.png';
            });
            mapa.addLayer(vectordr)
            mapa.addInteraction(drawRef.current);
            document.getElementById('imgDrawPoligon').src = 'disabled.png';
        } else {
            drawRefActive.current = false;
            mapa.removeLayer(getLayerText('poligono'))
            mapa.removeInteraction(drawRef.current);
            setActivarDraw(false);
            document.getElementById('imgDrawPoligon').src = 'area.png';
        }
    }
    function desactivarPoligonoDibujar() {
        if (activarDraw == true) {
            drawRefActive.current = false;
            mapa.removeLayer(getLayerText('poligono'))
            mapa.removeInteraction(drawRef.current);
            setActivarDraw(false);
            document.getElementById('imgDrawPoligon').src = 'area.png';
        }
    }
    function activarDrawMeasure(valor) {
        if (drawDistancia.current != null) {
            mapa.removeInteraction(drawDistancia.current);
        }
        drawRefActive.current = true;
        createHelpToolTip()
        createMeasureToolTip()
        if (capaDistancia.current == null) {
            capaAuxiliarDis.current = new VectorDraw();
            capaDistancia.current = new VectorLayer({
                text: 'Distancia Draw',
                title: 'Distancia Draw',
                visible: true,
                baseLayer: false,
                source: capaAuxiliarDis.current,
                style: {
                    'fill-color': 'rgba(255, 255, 255, 0.72)',
                    'stroke-color': '#01DFD7',
                    'stroke-width': 2,
                    'circle-radius': 7,
                    'circle-fill-color': '#ffcc33',
                },
            });
            mapa.addLayer(capaDistancia.current)
        }
        drawDistancia.current = new Draw({
            source: capaAuxiliarDis.current,
            type: valor == 'D' ? 'LineString' : 'Polygon',
            style: {
                'fill-color': '#E0E6F8',
                'stroke-color': '#6E6E6E',
                'stroke-width': 2,
                'circle-radius': 7,
                'circle-fill-color': '#ffcc33',
            },
        });
        drawDistancia.current.on('drawstart', function (evt) {
            // set sketch
            var sketch = evt.feature;
            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            let tooltipCoord = evt.coordinate;
            var listener = sketch.getGeometry().on('change', function (evt) {
                const geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                document.getElementById('measureTooltipElement').innerHTML = output;
                measureToolTip.current.setPosition(tooltipCoord);
            });
        });
        drawDistancia.current.on('drawend', function (evt) {
            var elemento = document.getElementById('measureTooltipElement')
            elemento.className = 'ol-tooltip ol-tooltip-static';
            elemento.id = "ant"
            createMeasureToolTip()
        });
        mapa.addInteraction(drawDistancia.current);
        setMedirTools(valor)
    }
    function createHelpToolTip() {
        var elemento = document.getElementById('helpTooltipElement');
        if (elemento) {
            elemento.parentNode.removeChild(elemento)
        }
        elemento = document.createElement('div')
        elemento.className = 'ol-tooltip hidden text-light';
        helpToolTip.current = new Overlay({
            element: elemento,
            offset: [15, 0],
            positioning: 'center-left'
        });
        mapa.addOverlay(helpToolTip.current);
    }
    function createMeasureToolTip() {
        if (document.getElementById('measureTooltipElement')) {
            document.getElementById('measureTooltipElement').parentNode.removeChild(document.getElementById('measureTooltipElement'));
        }
        var elemento = document.createElement('div')
        elemento.id = 'measureTooltipElement';
        elemento.className = 'ol-tooltip ol-tooltip-measure text-light';
        measureToolTip.current = new Overlay({
            element: elemento,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        })
        mapa.addOverlay(measureToolTip.current);
    }
    function getPosicionLegenda() {
        if (showInfo == true) {
            return 'leyendaImgAlt'
        } else {
            return 'leyendaImgAltMin'
        }
    }
    function mostrarCaminoMapa(dato) {
        setTipoPredio('camino' + dato.id);
        setEsSalo(false);
        var poligonoss = poligonosCamino.filter((item) => item.properties.date == dato.fechaRes)
        var features = []
        for (var featur of poligonoss) {
            var poligono = []
            for (var punto of featur.geometry.coordinates[0]) {
                poligono.push(proj.transform(punto, 'EPSG:4326', 'EPSG:3857'))
            }
            features.push({
                "type": "Feature",
                "properties": featur.properties,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [poligono]
                }
            })
        }
        var datosPoligono = {
            "type": "FeatureCollection",
            "name": "geometria_salo_inra",
            "crs": {
                "type": "name",
                "properties": {
                    "name": "urn:ogc:def:crs:EPSG::3857"
                }
            },
            "features": features
        }
        if (overlowCapaRef.current == null) {
            overlowCapaRef.current = new VectorLayer({
                source: new VectorDraw(),
                map: mapa,
                style: {
                    'stroke-color': 'rgba(19, 255, 98, 0.7)',
                    'stroke-width': 4,
                },
            });
        }
        var vectorSource = new VectorDraw({
            features: new GeoJSON().readFeatures(datosPoligono),
        });
        if (getLayerText('caminos') == null) {
            var capa = new VectorLayer({
                text: 'caminos',
                title: 'Capa Caminos',
                visible: true,
                baseLayer: false,
                source: vectorSource,
                style: {
                    'fill-color': 'rgba(255, 255, 255, 0.4)',
                    'stroke-color': '#8000FF',
                    'stroke-width': 2,
                    'circle-radius': 10,
                    'circle-fill-color': '#ffcc33',
                }
                //style: styleFunction,
            });
            mapa.addLayer(capa);
            mapa.getView().setCenter([-6615172.07959931, -2098072.5949959583])
            mapa.getView().setMaxZoom(22);
            mapa.getView().setMinZoom(0);
        } else {
            var capaCam = getLayerText('caminos');
            if (capaCam.getVisible() == false) {
                mapa.getView().setCenter([-6615172.07959931, -2098072.5949959583])
            }
            capaCam.setVisible(true);
            capaCam.setSource(vectorSource);
        }
    }
    function guardarIgualacionDeCampos(val) {
        if (val == true) {
            var campos = []
            for (var field in fieldTablaCapa) {
                campos.push({ 'tabla': fieldTablaCapa[field].column_name, 'capa': document.getElementById(`${field}-selector`).value })
            }
            savePoligonoPredio(campos);
        } else {
            setViewVentana(false);
            setFeaturesNuevos({});
        }
    }
    function checkAllFiles(lista) {
        var cont = 0;
        var extenciones = ['shp', 'shx', 'dbf', 'prj']
        for (var item of lista) {
            var nombreArch = item.name.split('.');
            if (extenciones.includes(nombreArch[nombreArch.length - 1])) {
                cont += 1;
            }
        }
        if (cont == extenciones.length) {
            return true;
        } else {
            return false;
        }
    }
    const cargarArchivoGeometria = (info, tipo) => {
        if (fieldTablaCapa.length !== 0) {
            if (getLayerText('newCapaUser') != null) {
                mapa.removeLayer(getLayerText('newCapaUser'))
            }
            var nombreArch = info.target.files[0].name.split('.');
            if (info.target.files.length == 1) {
                if (nombreArch[nombreArch.length - 1] == 'geojson') {
                    setLoading(true);
                    var formData = new FormData()
                    formData.append('file', info.target.files[0])
                    formData.append('fileName', info.target.files.name)
                    try {
                        axios.post(`${serverUrl}/archivo/uploadGeojson`, formData, {
                            'Accept': 'application/json',
                            'content-type': 'multipart/form-data'
                        }).then(res => {
                            if (res.data.ok) {
                                loadGeojsonUrl(res.data.ok, tipo);
                                MsgUtils.msgCorrecto("archivo cargado")
                            } else {
                                setLoading(false);
                                MsgUtils.msgError(res.data.error)
                            }
                            document.getElementById('fileUpload').value = null;
                            document.getElementById('fileUploadDos').value = null;
                        }).catch(error => {
                            //MsgUtils.msgError(JSON.parse(error.request.response).error);
                            document.getElementById('fileUpload').value = null;
                            document.getElementById('fileUploadDos').value = null;
                            setLoading(false);
                        })
                    } catch (error) {
                        document.getElementById('fileUpload').value = null;
                        document.getElementById('fileUploadDos').value = null;
                        MsgUtils.msgError(error.message);
                        console.error('Error al subir el archivo !!');
                    }
                } else if (nombreArch[nombreArch.length - 1] == 'kml') {
                    var formData = new FormData()
                    formData.append('file', info.target.files[0])
                    formData.append('fileName', info.target.files.name)
                    try {

                        setLoading(true);
                        axios.post(`${serverUrl}/archivo/uploadKml`, formData, {
                            'Accept': 'application/json',
                            'content-type': 'multipart/form-data'
                        }).then(res => {

                            if (res.data.ok) {
                                loadGeojsonUrl(res.data.ok, tipo);
                                MsgUtils.msgCorrecto("archivo cargado")
                            } else {
                                setLoading(false);
                                MsgUtils.msgError(res.data.error)
                            }
                            document.getElementById('fileUpload').value = null;
                            document.getElementById('fileUploadDos').value = null;
                        }).catch(error => {
                            //MsgUtils.msgError(JSON.parse(error.request.response).error);
                            document.getElementById('fileUpload').value = null;
                            document.getElementById('fileUploadDos').value = null;

                            setLoading(false);
                        })
                    } catch (error) {
                        document.getElementById('fileUpload').value = null;
                        document.getElementById('fileUploadDos').value = null;
                        MsgUtils.msgError(error.message);
                        console.error('Error al subir el archivo !!');
                    }
                } else {
                    document.getElementById('fileUpload').value = null;
                    document.getElementById('fileUploadDos').value = null;
                    MsgUtils.msgError("Archivo .shp , Seleccione todos los archivos que se muestra, al cargar archivos.")
                }
            } else {//if (nombreArch[nombreArch.length - 1] == 'shp') {
                if (checkAllFiles(info.target.files)) {
                    setLoading(true);
                    var formData = new FormData()
                    for (var fil of info.target.files) {
                        var archiv = fil
                        //formData.append('data', new Blob([archiv], { contentType: 'application/octet-stream', contentTransferEncoding: 'binary' }), archiv.name );
                        formData.append('file', archiv);
                    }
                    formData.append('fileName', archiv.name);
                    try {
                        axios.post(`${serverUrl}/archivo/upload`, formData, {
                            'Accept': 'application/json',
                            'content-type': 'multipart/form-data'
                        }).then(res => {
                            if (res.data.ok) {
                                document.getElementById('fileUpload').value = null;
                                document.getElementById('fileUploadDos').value = null;
                                loadGeojsonUrl(res.data.ok, tipo);
                                MsgUtils.msgCorrecto("archivo cargado")
                            } else {
                                document.getElementById('fileUpload').value = null;
                                document.getElementById('fileUploadDos').value = null;
                                setLoading(false);
                                MsgUtils.msgError(res.data.error)
                            }
                        }).catch(error => {
                            //MsgUtils.msgError(JSON.parse(error.request.response).error);
                            setLoading(false);
                        })
                    } catch (error) {
                        document.getElementById('fileUpload').value = null;
                        document.getElementById('fileUploadDos').value = null;
                        MsgUtils.msgError(error.message);
                        console.error('Error al subir el archivo !!');
                    }
                } else {
                    document.getElementById('fileUpload').value = null;
                    document.getElementById('fileUploadDos').value = null;
                    MsgUtils.msgError("Se necesita estas extenciones para cargar shapefile: shp,prj,shx,dbf")
                }
            }
        } else {
            document.getElementById('fileUpload').value = null;
            document.getElementById('fileUploadDos').value = null;
            setFeaturesNuevos({});
            MsgUtils.msgAdvertencia("No tiene Informacion de la tabla")
        }
    }
    function ponerGeojsonMap(datos, tipo) {
        var sourceNe = new VectorLayer({
            text: 'newCapaUser',
            title: 'Nueva Capa Usuario',
            visible: true,
            baseLayer: false,
            source: new VectorDraw({
                features: new GeoJSON().readFeatures(datos, {
                    dataProjection: datos.crs.properties.name,
                    featureProjection: mapa.getView().getProjection()
                })
            }),
            style: {
                'fill-color': 'rgba(255, 255, 255, 0.7)',
                'stroke-color': '#4bff00 ',
                'stroke-width': 2,
                'circle-radius': 10,
                'circle-fill-color': '#4bff00 ',
            },
        });
        var tipoPoligono = sourceNe.getSource().getFeatures()[0].getGeometry().getType();
        if (tipoPoligono == 'MultiPolygon' || tipoPoligono == 'Polygon') {
            var keyField = Object.keys(datos.features[0].properties);

            mapa.getView().setCenter(olExtent.getCenter(sourceNe.getSource().getExtent()));
            mapa.addLayer(sourceNe);
            mapa.getView().fit(sourceNe.getSource().getExtent(), { duration: 1000 })
            if (tipo == 'A') {
                setFieldCapaNueva(keyField);
                setViewVentana(true);
                setFeaturesNuevos({ 'features': datos.features, 'crs': datos.crs.properties.name });
            } else if (tipo == 'P') {
                if (getLayerText('poligono') != null) {
                    mapa.removeLayer(getLayerText('poligono'));
                }
            }
        } else {
            MsgUtils.msgAdvertencia("No es un poligono o multipoligono.")
        }
    }
    function loadGeojsonUrl(filename, tipo) {
        fetch(`${serverUrl}/document/${filename}`)
            .then(res => res.json())
            .then(data => {
                ponerGeojsonMap(data, tipo)
                setLoading(false);
            })
        //.catch(error => 
    }
    function savePoligonoPredio(fields) {
        var layerCapa = getLayerText('Predios');
        layerCapa.setVisible(false);
        setLoading(true);
        var crsOrigen = featuresNuevos.crs.split(':');
        fetch(`${serverUrl}/usuario/addPoligonoPredio`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'poligonos': featuresNuevos.features, 'crs': crsOrigen[crsOrigen.length - 1], 'fields': fields })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.ok) {
                    mapa.getView().setZoom(10);
                    layerCapa.setVisible(true);
                    mapa.removeLayer(getLayerText('newCapaUser'))
                    setFeaturesNuevos({});
                    setViewVentana(false);
                    setLoading(false);
                } else {
                    MsgUtils.msgError(data.error)
                }
            })
    }
    function cambiarCaroucel(valor) {
        if (valor == true) {
            if (indexCarousel < 1) {
                setIndexCarousel(indexCarousel + 1);
            }
        } else {
            if (indexCarousel > 0) {
                setIndexCarousel(indexCarousel - 1);
            }
        }
    }
    function crearSuscripcionPlanet(info) {

        var poligono = null
        if (getLayerText('poligono') != null) {
            var layer = getLayerText('poligono');

            poligono = { "type": "MultiPolygon", "coordinates": [layer.getSource().getFeatures()[0].getGeometry().getCoordinates()] }
        } else if (getLayerText('newCapaUser') != null) {
            var layer = getLayerText('newCapaUser');

            poligono = { "type": "MultiPolygon", "coordinates": layer.getSource().getFeatures()[0].getGeometry().getCoordinates() }
        } else {
            MsgUtils.msgError("No eligio poligono para la suscripción")
        }
        if (poligono != null) {
            var infoUser = JSON.parse(localStorage.getItem('info'))
            var fechaI = new Date()

            fetch(`${serverUrl}/planetap/createSuscription`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'geometria': poligono, ...featuresNuevos, ...info, 'nombre': `s_${fechaI.getTime()}_${infoUser.id}`, infoUser })
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        setShowModal(false);
                        MsgUtils.msgCorrecto("Suscripción creada Correctamente");
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
        }
    }
    function activarInfoAreaInra() {
        if (showAreasInra == false) {
            setActivarLegend(false);
            document.getElementById('imgLegend').src = 'legend.png';
            document.getElementById('imgAreaInra').src = 'disabled.png';
            if (getLayerText('Agua Suelo') != null) {
                getLayerText('Agua Suelo').setVisible(false);
            }
            if (getLayerText('salo') != null) {
                getLayerText('salo').setVisible(false);
            }
            if (getLayerText('caminos') != null) {
                getLayerText('caminos').setVisible(false);
            }
            if (getLayerText('Predios') != null) {
                getLayerText('Predios').setVisible(false);
            }
            if (getLayerText('Deforestacion') != null) {
                getLayerText('Deforestacion').setVisible(false);
            }
            if (getLayerText('Cultivos') != null) {
                getLayerText('Cultivos').setVisible(false);
            }
            if (getLayerText('PrediosSALO') != null) {
                getLayerText('PrediosSALO').setVisible(false);
            }
            var capaArea = getLayerText('AreasInra')
            capaArea.setVisible(true);
            mapa.getView().setMinZoom(0);
            mapa.getView().setZoom(6);
            fetch(`${serverUrl}/usuario/getAreasInra`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                }
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        setShowAreasInra(true);
                        setInfoAreainra(JSON.parse(data.ok));
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
        } else {
            var capaArea = getLayerText('AreasInra')
            capaArea.setVisible(false);
            document.getElementById('imgAreaInra').src = 'areasInra.png';
            setShowAreasInra(false);
        }
    }
    function getClaseMapa() {
        if (showInfo == false) {
            return 'mapContainer'
        } else {
            if ((selectFeature && esSalo == false && fechas.length != 0) || (esSalo && tipoPredio != 'Agua Suelo')) {
                return 'mapContainerSlider'
            } else {
                return 'mapContainerNormal'
            }
        }
    }
    function activarInfoMapa() {
        if (infoMapa == false) {
            setInfoMapa(true);
            document.getElementById('imgInfoMap').src = 'disabled.png';
        } else {
            setInfoMapa(false);
            document.getElementById('imgInfoMap').src = 'infoMapa.png';
        }
    }
    function descargarImagenHD(datos) {
        /*var token = 'wv96nu04u6nw904u6b'
        axios.get('https://earthtodate.com/v2/download_aoi/-16.565293,-62.98481,-16.560293,-62.97981/2024-03-31/30/10/tci?geotiff_nir_band=true', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
        })
            .then(response => {
        
                FileSaver.saveAs(response.data,"prueba.tiff")
                //let imgUrl = URL.createObjectURL(response.data)
        
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });*/
        setLoading(true);
        var fechaF = datos.fecha
        fetch(`${serverUrl}/archivo/descargarHD`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'bbox': datos.bbox, 'date': fechaF, 'dayback': 30, 'nube': 10, 'tipo': datos.tipo })
        })
            .then((res) => res.json())
            .then(data => {
                setLoading(false);
                if (data.ok) {
                    if (datos.tipo == 'IMG') {
                        FileSaver.saveAs(`${serverUrl}/document/${data.ok}`, `${fechaF}_HD.png`);
                    } else {
                        FileSaver.saveAs(`${serverUrl}/document/${data.ok}`, `${fechaF}_HD.tiff`);
                    }
                } else {
                    MsgUtils.msgError(data.error)
                }
            })
    }
    function calcularAreaDeforestada() {
        var geometrias = getGeometriaGeneral()
        if (geometrias != null) {
            fetch(`${serverUrl}/usuario/getAreaDeforestacion`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ geometrias, tipoPredio })
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        var lista = JSON.parse(data.ok).map(item => parseFloat(item.area));
                        let total = lista.reduce((a, b) => a + b, 0);
                        setInfoDefo({ 'data': JSON.parse(data.ok), 'areaTotal': total });
                        setTipoModal('A');
                        setTituloModal('AREA DEFORESTACIÓN');
                        setShowModal(true);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
        } else {
            MsgUtils.msgError("Dibuje un area para calcular el area de deforestación")
        }
    }
    function decargarGeojson() {
        if (tipoPredio.search('camino') != -1) {
            var geomet = getLayerText('caminos').getSource().getFeatures();
            var indice = parseInt(tipoPredio.replace('camino', ''));
            var caminoSelec = listaCaminos.filter(item => item.id == indice)[0]
            const geojsonFormat = new GeoJSON();
            const geojson = geojsonFormat.writeFeaturesObject(geomet, { featureProjection: 'EPSG:3857', defaultProjection: 'EPSG:3857' });
            const geojsonStr = JSON.stringify(geojson);
            const blob = new Blob([geojsonStr], { type: "application/json" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `camino(${caminoSelec.mesObs}-${caminoSelec.mesResu}).geojson`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            setLoading(true);
            fetch(`${serverUrl}/usuario/getDeforestacionCapa`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'mes': parseInt(tipoPredio[tipoPredio.length - 1]) })
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        FileSaver.saveAs(`${serverUrl}/document/${data.ok}`, `${new Date().toISOString().substring(0, 10)}_deforestacion.geojson`);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                }).finally(() => setLoading(false))
        }
    }
    function decargarShapefile() {
        if (tipoPredio.search('Defo') != -1) {
            //setLoading(true);
            fetch(`${serverUrl}/usuario/getDeforestacionShapefile`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'mes': parseInt(tipoPredio[tipoPredio.length - 1]) })
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        FileSaver.saveAs(`${serverUrl}/document/${data.ok}`, `${new Date().toISOString().substring(0, 10)}_deforestacion.zip`);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                }).finally(() => setLoading(false))
        }
    }
    function elegirAreaTrabajada(valor) {
        if (valor != '') {
            if (getLayerText('Agua Suelo') != null) {
                getLayerText('Agua Suelo').setVisible(false);
            }
            if (getLayerText('salo') != null) {
                getLayerText('salo').setVisible(false);
            }
            if (getLayerText('sentinel') != null) {
                getLayerText('sentinel').setVisible(false);
            }
            if (getLayerText('caminos') != null) {
                getLayerText('caminos').setVisible(false);
            }
            if (getLayerText('Predios') != null) {
                getLayerText('Predios').setVisible(false);
            }
            if (getLayerText('Deforestacion') != null) {
                getLayerText('Deforestacion').setVisible(false);
            }
            if (getLayerText('Cultivos') != null) {
                getLayerText('Cultivos').setVisible(false);
            }
            if (getLayerText('PrediosSALO') != null) {
                getLayerText('PrediosSALO').setVisible(false);
            }
            var filtroArea = listaAreasTrabajadas.filter(item => item.ciclo_agriario == valor)[0]
            var capa = getLayerText('Trabajadas');
            capa.getSource().updateParams({ "LAYERS": `cite:${filtroArea.layer_name}` });
            capa.getSource().updateParams({ 'CQL_FILTER': "is_active=1 or is_active=0" });
            capa.getSource().refresh();
            capa.setVisible(true);
            setTipoPredio(`trabajada0`);
            mapa.changed();
        } else {
            var capa = getLayerText('Trabajadas');
            capa.setVisible(false);
            setTipoPredio(null);
            mapa.changed();
        }
    }
    function elegirAreaSoya(valor) {
        if (valor != '') {
            if (getLayerText('Agua Suelo') != null) {
                getLayerText('Agua Suelo').setVisible(false);
            }
            if (getLayerText('salo') != null) {
                getLayerText('salo').setVisible(false);
            }
            if (getLayerText('sentinel') != null) {
                getLayerText('sentinel').setVisible(false);
            }
            if (getLayerText('caminos') != null) {
                getLayerText('caminos').setVisible(false);
            }
            if (getLayerText('Predios') != null) {
                getLayerText('Predios').setVisible(false);
            }
            if (getLayerText('Deforestacion') != null) {
                getLayerText('Deforestacion').setVisible(false);
            }
            if (getLayerText('Cultivos') != null) {
                getLayerText('Cultivos').setVisible(false);
            }
            if (getLayerText('PrediosSALO') != null) {
                getLayerText('PrediosSALO').setVisible(false);
            }
            if (getLayerText('Trabajadas') != null) {
                getLayerText('Trabajadas').setVisible(false);
            }
            var filtroArea = listaAreasTrabajadas.filter(item => item.ciclo_agriario == valor)[0]
            var capa = getLayerText('Soya');
            capa.getSource().updateParams({ "LAYERS": `cite:${filtroArea.layer_name_s}` });
            //capa.getSource().updateParams({ 'CQL_FILTER': "is_active=1 or is_active=0" });
            capa.getSource().refresh();
            capa.setVisible(true);
            setTipoPredio(`Soya0`);
            mapa.changed();
        } else {
            var capa = getLayerText('Soya');
            capa.setVisible(false);
            setTipoPredio(null);
            mapa.changed();
        }
    }
    function activarCapaInicial(tipoPredio, fechaa, nombreCapa, lado) {
        var capa = getLayerText('Predios')
        if (capa != null) {
            if (capa.getSource().getParams().LAYERS != tipoPredio.capaUPF) {
                capa.getSource().updateParams({ LAYERS: tipoPredio.capaUPF });
                tipoPredio.id == 'TEMP' ? capa.getSource().updateParams({ CQL_FILTER: '' }) : '';
                var capautb = getLayerText('utb');
                if (capautb != null) {
                    capautb.getSource().updateParams({ LAYERS: tipoPredio.capaUTB });
                    tipoPredio.id == 'TEMP' ? capautb.getSource().updateParams({ CQL_FILTER: '' }) : '';
                }
            }
        }
        var nombreUrl = ''
        if (tipoPredio.id == 'SWC') {
            nombreUrl = 'cite:' + getFechaNumerica(fechaa, 0) + '_swc';
        }else if(tipoPredio.id =='TEMP'){
            nombreUrl = 'cite:' + getFechaNumerica(fechaa, 0) + '_1330_tem'
        }else if(tipoPredio.id == 'TEMP2'){
            nombreUrl = 'cite:' + getFechaNumerica(fechaa, 0) + '_0130_tem'
        }
        var capa = getLayerText(nombreCapa);
        if (capa != null) {
            modificarUrl(nombreUrl, nombreCapa);
            if (lado != '') {
                if (lado == 'R') {
                    swipeRef.current.addLayer(capa, true);
                } else if (lado == 'L') {
                    swipeRef.current.addLayer(capa);
                }
            }
            capa.setVisible(true);
        } else {
            var imge = new Image({
                text: nombreCapa,
                title: nombreCapa,
                visible: true,
                baseLayer: false,
                source: new ImageWMS({
                    url: "https://geon.forestryai.cl/geoserver/wms",
                    params: {
                        'LAYERS': nombreUrl,
                        transparent: true,
                        format: 'image/png', 'SRS': 'EPSG:3857'
                    },
                    ratio: 1,
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            })
            mapa.addLayer(imge);
            if (lado != '') {
                if (lado == 'R') {
                    swipeRef.current.addLayer(imge, true)
                } else if (lado == 'L') {
                    swipeRef.current.addLayer(imge)
                }
            }
        }
    }
    const activarImgMapa = async (tipo) => {
        try {
            var parametros;
            if (tipo.id == 'SWC') {
                setLoading(true);
                parametros = {
                    "tipoPredio": "SWC",
                    "fechaIni": "2024/01/25",
                    "fechaFin": "2024/02/28"
                }
            } else if (tipo.id == 'TEMP') {
                setLoading(true);
                parametros = {
                    "tipoPredio": tipo.id,
                    "fechaIni": "2025/01/15",
                    "fechaFin": "2025/01/31"
                }
            } else if (tipo.id == 'TEMP2') {
                setLoading(true);
                parametros = {
                    "tipoPredio": tipo.id,
                    "fechaIni": "2025/01/15",
                    "fechaFin": "2025/01/31"
                }
            }
            var resultado = await PlanetApi.getFechasImagen(parametros)
            if (resultado.ok) {
                setAuxFechas(resultado.ok)
                setFechasHum(resultado.ok.map(item => item.fecha));
                desactivarPoligonoDibujar()
                setSelectFeature(false);
                setNumDia(resultado.ok.length - 1);
                setEsSalo(true);
                setTituloModal(`Estadísticas ${tipo.nombre}`);
                setTipoPredio(tipo.id);
                setSelectTipoPredio(tipo);
                activarCapaInicial(tipo, resultado.ok[resultado.ok.length - 1].fecha, 'Ortofoto', '');
                tipo.id == 'SWC' ? filtraarPrediosRiego('RIEGO ETAPA 1') : ''
                tipoActivado.current = tipo.id;
                mapa.getView().setCenter(tipo.id == 'SWC' ? [-8049850.041933985, -4457582.448156962] : [-8090611.7475655135, -4524011.613538556])
                mapa.getView().setZoom(12);
                //obtenerFechasAgua('2024-06-23', '2024-05-01', item)
            } else {
                MsgUtils.msgError(resultado.error);
            }
        } catch (error) {
            MsgUtils.msgError(error)
        } finally {
            setLoading(false);
        }
    }
    function filtraarPrediosRiego(valor) {
        setFiltroFundoRiego(valor);
        var filtrNivel = filtrosCapas.filter(item => item.id == nivelCapa)[0];
        var capa = getLayerText(filtrNivel.capa);
        capa.getSource().updateParams({ CQL_FILTER: "c_dsc_faen='" + valor + "' and c_dsc_agru='" + filtroRiegoGestion + "'" });
        capa.setVisible(true);
        var capaSeleccion = getLayerText(filtrNivel.capaselc);
        capaSeleccion.setVisible(false);
        mapa.changed()
        //mapa.getView().setZoom(8);
    }
    function filtrarGestion(valor) {
        var filtrNivel = filtrosCapas.filter(item => item.id == nivelCapa)[0];
        var capa = getLayerText(filtrNivel.capa);
        setFiltroRiegoGestion(valor);
        capa.getSource().updateParams({ CQL_FILTER: "c_dsc_faen='" + filtroFundoRiego + "' and c_dsc_agru='" + valor + "'" });
        capa.setVisible(true);
        var capaSeleccion = getLayerText(filtrNivel.capaselc);
        capaSeleccion.setVisible(false);
        mapa.changed()
        //mapa.getView().setZoom(8);
    }
    function actividadPanelBusqueda(val, objeto) {
        if (val == 0) {
            setActivarDivisor(false);
        } else if (val == 1) {
            var cordenadas = JSON.parse(objeto.geometria);
            var datosPoligono = {
                "type": "FeatureCollection",
                "name": "geometria_salo_inra",
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:EPSG::3857"
                    }
                },
                "features": [{
                    "type": "Feature",
                    "geometry": cordenadas
                }]
            }
            var vectorSource = new VectorDraw({
                features: new GeoJSON().readFeatures(datosPoligono),
            });
            setInfoPredio(objeto);
            setGeometria(JSON.parse(objeto.geometria_gen));
            geometriaAux.current = JSON.parse(objeto.geometria_gen);
            setTipoPredio(saloWms[0].id);
            setSelectFeature(true);
            setSelectTipoPredio(saloWms[0]);
            setTituloModal("Estadísticas " + saloWms[0].nombre + ' ' + filtroFundoRiego);
            setEsSalo(true);
            obtenerFechas(saloWms[0], '2024/11/01', '2024/12/19');
            desactivarCapas()
            var filtroNivel = filtrosCapas.filter(item => item.id == nivelCapa)[0]
            var capa = getLayerText(filtroNivel.capaselc);
            capa.getSource().updateParams({ CQL_FILTER: "gid=" + objeto.gid });
            capa.setVisible(true);
            var capa = getLayerText(filtroNivel.capa);
            setFiltroRiegoGestion(objeto.c_dsc_agru);
            setFiltroFundoRiego(objeto.c_dsc_faen);
            capa.getSource().updateParams({ CQL_FILTER: "c_dsc_faen='" + objeto.c_dsc_faen + "' and c_dsc_agru='" + objeto.c_dsc_agru + "'" });
            capa.setVisible(true);
            mapa.getView().setCenter([objeto.x, objeto.y])
            mapa.getView().fit(vectorSource.getExtent(), { size: mapa.getSize() })
        } else if (val == 3) {
            setTipoModal('E');
            setShowModal(true);
        }
    }
    function desactivarCapas() {
        getLayerText('Predios').setVisible(false);
        getLayerText('panio').setVisible(false);
        getLayerText('utb').setVisible(false);
        getLayerText('seleccion').setVisible(false);
        getLayerText('seleccionA').setVisible(false);
        getLayerText('seleccionB').setVisible(false);
    }
    function cambiarNivelCapa(valor) {
        //setActivarDivisor(false)
        setNivelCapa(valor);
        desactivarCapas();
        var filtroCap = filtrosCapas.filter(item => item.id == valor)[0]
        var capa = getLayerText(filtroCap.capa);
        tipoPredio == 'SWC' ? capa.getSource().updateParams({ CQL_FILTER: "c_dsc_faen='" + filtroFundoRiego + "' and c_dsc_agru='" + filtroRiegoGestion + "'" }) : '';
        capa.setVisible(true);
        mapa.changed()
    }
    useEffect(() => {
        if (viewP == false) {
            setViewP(true);
            obtenerInfoCollection();
            agregarCapaInicial();
        }
    }, [])
    return (
        <>
            <div className='container-fluid w-100'>
                <div className={`row ${activarDivisor == false ? 'row-cols-1' : 'row-cols-2'} `}>
                    <div className='col m-0 p-0' style={{ width: `${activarDivisor == true ? '60%' : '100%'}` }}>
                        <div ref={refMapa} className={getClaseMapa()} ></div>
                    </div>
                    {activarDivisor == true &&
                        <div className='col m-0 p-0' style={{ width: `${activarDivisor == true ? '40%' : '0%'}` }}>
                            <BuscarPredio collback={(val, objeto) => actividadPanelBusqueda(val, objeto)} filtros={{ filtroFundoRiego, filtroRiegoGestion }} />
                        </div>}
                </div>
            </div>
            {mostrarLeyenda == true && datosUser.leyendaImgHd == 1 && <div className={`alert alert-light m-1 p-0 ${getPosicionLegenda()}`} >
                SkyCues EarthToDate, contains modified Copernicus Sentinel data [{anioHD}]
            </div>}
            {showInfo == false && <button className='btn m-0 p-1 btDetalle btFlotanteMenu btnMapaR'
                title='Mostrar Detalle' onClick={() => setShowInfo(true)}>
                <img src='detalles.png' className='imgMapa' id='imgDetalle' />
            </button>}
            <button className='btn m-0 p-1 btnSwipe btFlotanteMenu btnMapaR'
                title='boton Swipe' onClick={() => eventoSwipe()}>
                <img src='swipe.png' className='imgMapa' id='imgSwipe' />
            </button>
            {activarDivisor == false && <button className='btn m-0 p-1 btnLegend btFlotanteMenu btnMapaR'
                title='Boton Legenda' onClick={() => activarLegenda()}>
                <img src='legend.png' className='imgMapa' id='imgLegend' />
            </button>}
            <button className='btn m-0 p-1 btnAreaInra btFlotanteMenu btnMapaR d-none'
                title='Areas Inra' onClick={() => activarInfoAreaInra()}>
                <img src='areasInra.png' className='imgMapa' id='imgAreaInra' />
            </button>
            <button className='btn m-0 p-1 btnDrawing btFlotanteMenu btnMapaR'
                title='Boton Legenda' onClick={() => {
                    if (showToolArea == false) {
                        setShowToolArea(true);
                        document.getElementById('imgDrawing').src = 'disabled.png';
                    } else {
                        setShowToolArea(false);
                        document.getElementById('imgDrawing').src = 'medicion.png';
                        if (drawDistancia.current != null) {
                            mapa.removeInteraction(drawDistancia.current)
                        }
                        mapa.removeLayer(capaDistancia.current);
                        mapa.removeControl(helpToolTip.current);
                        mapa.removeControl(measureToolTip.current);
                        mapa.removeLayer()
                        drawRefActive.current = false;
                        capaDistancia.current = null;
                        capaAuxiliarDis.current = null;
                        setMedirTools('')
                        var elementos = document.getElementsByClassName("ol-overlay-container ol-selectable");
                        for (var i = 0; i < elementos.length; i = i + 1) {
                            elementos[i].remove();
                        }
                    }
                }}>
                <img src='medicion.png' className='imgMapa' id='imgDrawing' />
            </button>
            <button className='btn m-0 p-1 btnDrawm btFlotanteMenu btnMapaR'
                title='Boton Dibujar Poligono' onClick={() => activarDrawPoligon()}>
                <img src='area.png' className='imgMapa' id='imgDrawPoligon' ></img>
            </button>
            <label className='btn m-0 p-1 btnAddGeo btFlotanteMenu btnMapaR' title='Subir Geometria con un archivo'>
                <img src='addPoligono.png' className='imgMapa mx-auto my-auto' ></img>
                <input type="file" accept=".shp,.dbf,.shx,.prj,.geojson,.kml"
                    multiple='true' id='fileUpload' webkitRelativePath='true'
                    onChange={(e) => cargarArchivoGeometria(e, 'P')} />
            </label>
            <button className='btn m-0 p-1 btnExtPredio btFlotanteMenu btnMapaR'
                title='Extender a la vista general de los fundos disponibles' onClick={() => activarInfoMapa()}>
                <img src='verPredios.png' className='imgMapa' id='imgExtPredio' ></img>
            </button>
            <button className='btn m-0 p-1 btnInfoMap btFlotanteMenu btnMapaR'
                title='Información del Mapa' onClick={() => activarInfoMapa()}>
                <img src='infoMapa.png' className='imgMapa' id='imgInfoMap' ></img>
            </button>
            <div className='treContenido'>
                <Collapse in={showTree} dimension="width">
                    <div id="example-collapse-text" className='container-fluid colorFondoModal2 py-1'>
                        <div className='row row-cols-2 gx-1'>
                            <div className="col-8 text-light fw-bold my-auto">Capas</div>
                            <div className='col-4 my-auto'>
                                <button className='btn btn-transparent btn-sm text-light' onClick={() => setShowTree(false)}><i className="fa-solid fa-circle-xmark fa-xl"></i></button></div>
                        </div>
                        <TreeLayer mapa={mapRef} collback={cambiarVistaLayer} actualizar={showTree} tipoPagina={tipoPagina} />
                    </div>
                </Collapse>
            </div>
            <div className='toolsMedicion colorFondoModal'>
                <Collapse in={showToolArea} dimension="width">
                    <div id="example-collapse-text">
                        <div className="container text-light my-auto">
                            <Form.Check
                                onChange={() => activarDrawMeasure('D')}
                                checked={medirTools == 'D' ? true : false}
                                reverse
                                label="Distancia"
                                name="Distancia"
                                type="radio"
                                id={`reverse-radio-1`}
                            />
                            <Form.Check
                                onChange={() => activarDrawMeasure('A')}
                                checked={medirTools == 'A' ? true : false}
                                reverse
                                label="Area"
                                name="Area"
                                type="radio"
                                id={`reverse-radio-2`}
                            />
                        </div>
                    </div>
                </Collapse>
            </div>
            <div className='colorFondoModal showInfoMapa'>
                <Collapse in={infoMapa} dimension="width">
                    <div className='container-fluid text-center'>
                        <div className='text-light fw-bold' id='zoomMapa'></div>
                        <div className='text-light fw-bold' id='latitudMapa'></div>
                        <div className='text-light fw-bold' id='longitudMapa'></div>
                    </div>
                </Collapse>
            </div>
            <div className='colorFondoModal showAreasInra'>
                <Collapse in={showAreasInra} dimension="width">
                    <div className='table-responsive'>
                        <table className="table table-sm table-dark table-bordered border-light">
                            <thead>
                                <tr>
                                    <th width='150'>Variable</th>
                                    <th width='100'>Superficie(Ha)</th>
                                    <th width='100'>Segun Contrato(Ha)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {infoAreainra.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th><div className='text-light' style={{ backgroundColor: `${item.color}` }}>{item.variable}</div></th>
                                            <td className='text-end'>{parseInt(item.superficie).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='text-end'>{parseInt(item.sup_con).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Collapse>
            </div>
            <div className={`contenedor-flotante w-100 text-center ${showInfo ? '' : 'd-none'}`}>
                {showMapaBase == true && <div className='container-fluid text-center py-1'>
                    <div className='btn-group'>
                        <div className="input-group mx-auto mb-2 px-1" style={{ width: '260px' }}>
                            <span className=" input-group-text text-dark text-bold px-1 p-0">Gestion Mapa Planet</span>
                            <select className="form-select form-select-sm "
                                value={selectGestion} onChange={(e) => setSelectGestion(e.target.value)}>
                                <option value={''}>TODOS</option>
                                {gesionMap.map((item, index) => {
                                    return (<option key={index} value={item}>{item}</option>)
                                })}
                            </select>
                        </div>
                        <div className="input-group mx-auto mb-2 px-1" style={{ width: '260px' }}>
                            <span className=" input-group-text text-dark text-bold px-1 p-0">Indice Espectral</span>
                            <select className="form-select form-select-sm "
                                value={tipoBaseMapa} onChange={(e) => cambiarTipoMapaBase(e.target.value)}>
                                {baseVariPla.map((item, index) => {
                                    return (<option key={index} value={item.id}>{item.nombre}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='contenedorSliderMapa'>
                        <SliderBaseMap fechas={sliderMap}
                            collback={(val) => mostrarBaseMapL(val)} gestion={selectGestion} />
                    </div>
                </div>}
                <div className='container-fluid'>
                    {selectFeature && esSalo == false && fechas.length != 0 &&
                        <div className='row row-cols-3'>
                            <div className='col text-start'>
                                <button className='btn btn-sm text-light' title='Fechas atras'
                                    onClick={() => obtenerFecha('A')}>
                                    <i className="fa-solid fa-angle-left"></i></button>
                            </div>
                            <div className='col my-auto'>
                                <label className="fs-6 text-light fw-bold"><i className="fa-solid fa-calendar-days "></i>{` Fecha : ${fechas.length == 0 ? '-' : getDateFormat(fechas[numDia])}`}</label>
                            </div>
                            <div className='col text-end'>
                                <button className='btn btn-sm text-light' title='Fechas adelante'
                                    onClick={() => obtenerFecha('S')}>
                                    <i className="fa-solid fa-angle-right"></i></button>
                            </div>
                        </div>}
                    {selectFeature && esSalo == false && fechas.length != 0 && <div className='px-2'> <SliderFecha fechas={fechas} tipo='S' selectTipoPredio={selectTipoPredio} collback={(val) => obtenerWmsDate(val)} /></div>}
                    {esSalo && ['SWC', 'TEMP', 'TEMP2'].includes(tipoPredio) == false && <label className="fs-6 text-light fw-bold"><i className="fa-solid fa-calendar-days fa-fade"></i>{` Fecha : ${fechaHum.length == 0 ? '-' : getDateFormat(fechaHum[numDia])}`}</label>}
                    {esSalo && ['SWC', 'TEMP', 'TEMP2'].includes(tipoPredio) == false && <div className='px-4'><SliderFecha fechas={fechaHum} tipo='V' selectTipoPredio={selectTipoPredio} collback={(val) => obtenerWmsDate(val)} /></div>}
                    {(['SWC', 'TEMP', 'TEMP2'].includes(tipoPredio) == true) && esSalo == true && fechaHum.length != 0 &&
                        <div className='row row-cols-3'>
                            <div className='col text-start'>
                                <button className='btn btn-sm text-light ' title='Fechas atras'
                                    onClick={() => obtenerFecha('A')}>
                                    <i className="fa-solid fa-angle-left"></i></button>
                            </div>
                            <div className='col my-auto'>
                                <label className="fs-6 text-light fw-bold"><i className="fa-solid fa-calendar-days "></i>{` Fecha : ${fechaHum.length == 0 ? '-' : getDateFormat(fechaHum[numDia])}`}</label>
                            </div>
                            <div className='col text-end'>
                                <button className='btn btn-sm text-light ' title='Fechas adelante'
                                    onClick={() => obtenerFecha('S')}>
                                    <i className="fa-solid fa-angle-right"></i></button>
                            </div>
                        </div>}
                    {(['SWC', 'TEMP', 'TEMP2'].includes(tipoPredio) == true) && esSalo == true && fechaHum.length != 0 &&
                        <div className='px-4'>
                            <SliderFecha fechas={fechaHum} tipo='S' selectTipoPredio={selectTipoPredio}
                                collback={(val) => obtenerWmsDate(val)} />
                        </div>}
                </div>
                <div className='container-fluid m-0 p-0' >
                    <div className='row row-cols-3 gx-0'>
                        <div className='col text-start'>
                            <div className='btn-group '>
                                <button className={`btn btn-sm mx-0 px-0 ${indexCarousel > 0 ? '' : 'd-none'}`}
                                    title='Ir Atras del panel'
                                    onClick={() => cambiarCaroucel(false)}>
                                    <img src='/btnCaroucel.png' className='btnRotar' width='25'></img>
                                </button>

                            </div>
                        </div>
                        <div className='col my-auto' >

                        </div>
                        <div className='col text-end'>
                            <div className='btn-group btn-group-sm'>
                                {false && <label className='btn btn-sm btn-dark bg-gradient' title='Añadir poligonos a la capa de predios'>
                                    <img src='addPredio.png' className='imgMapa mx-auto my-auto' ></img>
                                    <input type="file" accept=".shp,.dbf,.shx,.prj,.geojson,.kml" id='fileUploadDos'
                                        multiple='true' webkitRelativePath='true'
                                        onChange={(e) => cargarArchivoGeometria(e, 'A')} />
                                </label>}
                                <button className='btn btn-transparent btn-sm text-light'
                                    title='Descargar Imagen'
                                    disabled={selectFeature ? false : true}
                                    onClick={() => {
                                        if (selectTipoPredio != null) {
                                            setTituloModal(`Descargar Imagen ${selectTipoPredio.nombre}`); setTipoModal('D'); setShowModal(true);
                                        } else {
                                            if (tipoPredio.search('camino') != -1) {
                                                setTituloModal('Descarga Camino');
                                                setTipoModal('F');
                                                setShowModal(true);
                                            } else if (tipoPredio.search('Defo') != -1) {
                                                setTituloModal('Descarga Deforestación');
                                                setTipoModal('Z');
                                                setShowModal(true);
                                            } else {
                                                MsgUtils.msgAdvertencia("Seleccione un indice por favor ...")
                                            }
                                        }
                                    }}>
                                    <i class="fa-solid fa-images"></i></button>
                                {(selectFeature == true && esSalo == true) && <button className='btn btn-sm btn-light text-success mx-0'
                                    title='Mostrar las Estadísticas'
                                    onClick={() => {
                                        if (tipoPredio !== 'CATASTRAL') {
                                            if (true) {
                                                var poligon = getLayerText('poligono');
                                                if (poligon != null) {
                                                    let features = poligon.getSource().getFeatures();
                                                    features.forEach(feature => {
                                                        let geometry = feature.getGeometry();
                                                        setGeometria({ "type": "MultiPolygon", "coordinates": geometry.getCoordinates() });
                                                        setSelectFeature(true);
                                                    });
                                                    setTipoGeomatria('D');
                                                }
                                            }
                                            setTipoModal('E');
                                            setShowModal(true);
                                        } else {
                                            setTipoModal('W');
                                            setShowModal(true);
                                        }
                                    }}>
                                    <i className="fa-solid fa-chart-simple"></i></button>}
                                {selectFeature == true && esSalo == true &&
                                    <button className='btn btn-info btn-sm' id='btnShowInfo'
                                        title='Mostrar Información del predio Seleccionado'
                                        disabled={selectFeature ? false : true}
                                        onClick={() => {
                                            setTipoModal('I');
                                            if (nivelCapa == '1') {
                                                setTituloModal('Información de la Faena');
                                            } else if (nivelCapa == '2') {
                                                setTituloModal('Información del Paño');
                                            } else if (nivelCapa == '3') {
                                                setTituloModal('Información de la UTB');
                                            }
                                            setShowModal(true);
                                        }}>
                                        <i className="fa-solid fa-circle-info"></i>
                                    </button>}
                                <button className='btn botonOscuro btn-sm'
                                    title='Buscar un predio'
                                    //disabled={selectFeature ? false : true}
                                    onClick={() => { setActivarDivisor(true) }}>
                                    <i className="fa-solid fa-magnifying-glass-location"></i>
                                </button>
                                {false && <button className={`btn btn-sm mx-0 px-0 ${indexCarousel < 1 ? '' : 'd-none'}`}
                                    title='Ir al siguiente panel'
                                    onClick={() => cambiarCaroucel(true)}>
                                    <img src='/btnCaroucel.png' width='25'></img>
                                </button>}
                                <button className="btn btn-sm mx-0 px-0"
                                    title='Cerrar el Panel'
                                    onClick={() => setShowInfo(false)}>
                                    <img src="/salir.png" width="28" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className=' text-center' style={{ height: '84px' }}>
                        <Carousel slide={false} fade={false} controls={false} indicators={false} interval={false} activeIndex={indexCarousel}>
                            <Carousel.Item>
                                <div className='row row-cols gx-1'>
                                    <div className='col' style={{ minWidth: '270px', maxWidth: '400px' }}>
                                        <div className='container-fluid cardColorA  text-center' >
                                            <div className='container-fluid'>
                                                <div className='fw-bold'>Variables Planetarias</div>
                                            </div>
                                            <div className='container-fluid overflow-auto' style={{ minHeight: '65px', maxHeight: '65px' }}>
                                                <div className=''>
                                                    {saloWms.map((item, index) => {
                                                        if (item.tipo == 'A') {
                                                            return (
                                                                <div className={`w-100 ${tipoPredio.indexOf(item.id) != -1 ? 'optActivate' : ''}`} key={index}>
                                                                    <hr className="dropdown-divider m-0 p-0"></hr>
                                                                    <div className='row row-cols-2 gx-1'>
                                                                        <div className='col-10 my-auto text-start'>
                                                                            <div>{item.nombre}</div>
                                                                        </div>
                                                                        <div className='col-2'>
                                                                            <button className="btn m-0 p-0"
                                                                                onClick={() => {
                                                                                    if (actiSwip == false) {
                                                                                        activarImgMapa(item);
                                                                                    } else {
                                                                                        MsgUtils.msgAdvertencia("Desactive el swipe, y luego elija otro indice ,por favor...")
                                                                                    }
                                                                                }}>
                                                                                <img src="/ver.png" className='my-auto' width="25" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {tipoPredio != undefined && ['SWC', 'TEMP', 'TEMP2'].includes(tipoPredio) == true &&
                                        <div className='col' style={{ minWidth: '320px', maxWidth: '120px' }}>
                                            <div className='container-fluid cardColorB text-center'>
                                                <div className='container-fluid mb-1'>
                                                    <hr className="dropdown-divider m-0 p-0"></hr>
                                                </div>
                                                <div className='container-fluid overflow-auto' style={{ minHeight: '65px', maxHeight: '65px' }}>
                                                    <div className='input-group input-group-sm mb-1'>
                                                        <span className="input-group-text bg-transparent text-light fw-bold" style={{ border: 'none' }}>Niveles</span>
                                                        <select className="form-select form-select-sm bgColorB"
                                                            id='selectNivelCapa' value={nivelCapa}
                                                            onChange={(e) => cambiarNivelCapa(e.target.value)}>
                                                            {filtrosCapas.map((item, index) => {
                                                                if ((['TEMP', 'TEMP2'].includes(tipoPredio) == true && item.id != 2) || (tipoPredio == 'SWC' && item.id != 2)) {
                                                                    return (<option value={item.id} key={index}>{item.nombre}</option>)
                                                                }
                                                            })}
                                                        </select>
                                                    </div>
                                                    {['TEMP', 'TEMP2'].includes(tipoPredio) == true && <div className='input-group input-group-sm'>
                                                        <span className="input-group-text bg-transparent text-light fw-bold" style={{ border: 'none' }}>Tiempo Solar</span>
                                                        <select className="form-select form-select-sm bgColorB"
                                                            id='selectimesolar' value={tipoPredio}
                                                            onChange={(e) => {
                                                                var dato = selectTipoPredio
                                                                dato.id = (e.target.value)
                                                                activarImgMapa(dato)
                                                            }}>
                                                            {timeSolar.map((item, index) => {
                                                                return (<option value={item.id} key={index}>{item.nombre}</option>)
                                                            })}
                                                        </select>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>}
                                    {tipoPredio != undefined && tipoPredio == 'SWC' && <div className='col' style={{ minWidth: '320px', maxWidth: '120px' }}>
                                        <div className='container-fluid cardColorA text-center'>
                                            <div className='container-fluid mb-1'>
                                                <hr className="dropdown-divider m-0 p-0"></hr>
                                            </div>
                                            <div className='container-fluid overflow-auto' style={{ minHeight: '65px', maxHeight: '65px' }}>
                                                <div className='input-group input-group-sm mb-1'>
                                                    <span className="input-group-text bg-transparent text-dark fw-bold" style={{ border: 'none' }}>Gestión</span>
                                                    <select className="form-select form-select-sm bgColorA"
                                                        id='selectGestion' value={filtroRiegoGestion}
                                                        onChange={(e) => filtrarGestion(e.target.value)}>
                                                        {listaGestiones.map((item, index) => {
                                                            return (<option value={item.nombre} key={index}>{item.nombre}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text bg-transparent text-dark fw-bold" style={{ border: 'none' }}>Faena</span>
                                                    <select className="form-select form-select-sm bgColorA" id='selectFaena' value={filtroFundoRiego}
                                                        onChange={(e) => filtraarPrediosRiego(e.target.value)}>
                                                        {filtroPrediosRiego.map((item, index) => {
                                                            return (<option value={item.nombre} key={index}>{item.nombre}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className='row row-cols gx-1'>
                                    {listaCaminos.length != 0 && permisoModulo(2) &&
                                        <div className='col' style={{ minWidth: '190px', maxWidth: '210px' }}>
                                            <div className='container-fluid cardColorA text-center'>
                                                <div className='fw-bold'>
                                                    Caminos
                                                </div>
                                                <div className='container-fluid overflow-auto' style={{ minHeight: '65px', maxHeight: '65px' }}>
                                                    {listaCaminos.map((item, index) => {
                                                        return (
                                                            <div className={`w-100 ${'camino' + item.id == tipoPredio ? 'optActivate' : ''}`} key={index}>
                                                                <hr className="dropdown-divider m-0 p-0"></hr>
                                                                <div className='row row-cols-2 gx-1'>
                                                                    <div className='col-10 my-auto text-start'>
                                                                        <div>{item.mesObs + ' - ' + item.mesResu}</div>
                                                                    </div>
                                                                    <div className='col-2'>
                                                                        <button className="btn m-0 p-0" onClick={() => {
                                                                            if (actiSwip == false) {
                                                                                desactivarPoligonoDibujar();
                                                                                setSelectTipoPredio(null);
                                                                                setSelectFeature(false);
                                                                                setEsSalo(false);
                                                                                setActivarLegend(false);
                                                                                mostrarCaminoMapa(item);
                                                                                tipoActivado.current = 'CAMINO';
                                                                            } else {
                                                                                MsgUtils.msgAdvertencia("Desactive swipe, y elija el nuevo indice, por favor...")
                                                                            }
                                                                        }}>
                                                                            <img src="/ver.png" className='my-auto' width="25" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>}
                                    <div className='col' style={{ minWidth: '190px', maxWidth: '190px' }}>
                                        <div className='container-fluid cardColorB text-center'>
                                            <div className='container-fluid' >
                                                <div className="mb-1">
                                                    <span className="text-light fw-bold my-auto">Soya</span>
                                                    <select className="form-select form-select-sm"
                                                        onChange={(e) => elegirAreaSoya(e.target.value)}>
                                                        <option value={''}>Ninguno</option>
                                                        {listaAreasTrabajadas.map((item, index) => {
                                                            return (<option value={item.ciclo_agriario} key={index}>
                                                                {getFechaDMA(item.fecha_ini, 0) + '-' + getFechaDMA(item.fecha_fin, 0)}
                                                            </option>)
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {permisoModulo(6) && <div className='col' style={{ maxWidth: '320px', minWidth: '320px' }}>
                                        <div className='container-fluid cardColorA text-center' >
                                            <div className='container-fluid'>
                                                <div className='fw-bold'>Suscripciones</div>
                                            </div>
                                            <div className='overflow-auto container-fluid' style={{ minHeight: '65px', maxHeight: '65px' }}>
                                                <div className=' '>
                                                    {listaSuscripciones.map((item, index) => {
                                                        return (
                                                            <div className={`w-100 ${item.id == tipoPredio ? 'optActivate' : ''}`} key={index}>
                                                                <hr className="dropdown-divider m-0 p-0"></hr>
                                                                <div className='row row-cols-2 gx-1'>
                                                                    <div className='col-10 my-auto text-start'>
                                                                        <div>{item.descripcion}</div>
                                                                    </div>
                                                                    <div className='col-2'>
                                                                        <button className="btn m-0 p-0" onClick={() => {
                                                                            if (actiSwip == false) {
                                                                                if (getLayerText('poligono') != null || getLayerText('newCapaUser') != null) {
                                                                                    setFeaturesNuevos(item);
                                                                                    setTipoModal('S')
                                                                                    setTituloModal("Crear Suscripción " + item.descripcion);
                                                                                    setShowModal(true);
                                                                                    tipoActivado.current = 'SUSCRIP';
                                                                                } else {
                                                                                    MsgUtils.msgError("No existe poligono para crear suscripción")
                                                                                }
                                                                            } else {
                                                                                MsgUtils.msgAdvertencia("Desactive swipe, y elija el nuevo indice, por favor...")
                                                                            }
                                                                        }}>
                                                                            <img src="/addSuscript.png" className='my-auto' width="25" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <div className='container-fluid d-none'>
                        <div className='text-center fw-bold text-light'>Contenido Agua en el Suelo</div>
                        <SliderFecha fechas={fechaHum} collback={(val) => obtenerWmsDateHum(val)} />
                    </div>
                </div>
            </div >
            {activarLegend == true && <div className='legendContenido'>
                <PrincipalLegend tipoPredio={tipoPredio} />
            </div>
            }
            <Modal show={showModal}
                onHide={() => setShowModal(false)}
                size={(tipoModal === 'I' || tipoModal == 'S' || tipoModal == 'D' || tipoModal == 'T' || tipoModal == 'H' || tipoModal == 'A' || tipoModal == 'F' || tipoModal == 'Z' || tipoModal == 'B' || tipoModal == 'X') ? "sm" : "xl"}
                fullscreen={(tipoModal === 'I' || tipoModal == 'S' || tipoModal == 'D' || tipoModal == 'T' || tipoModal == 'H' || tipoModal == 'A' || tipoModal == 'F' || tipoModal == 'Z' || tipoModal == 'B' || tipoModal == 'X') ? false : true}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-gradient bg-dark text-light'
                centered>
                <Modal.Header closeButton>
                    <h5>{tituloModal}</h5>
                </Modal.Header>
                <Modal.Body className='m-1 p-0'>
                    {tipoModal === 'E' &&
                        <StadisticShow getGeometry={getGeometriaGeneral} tipoPredio={tipoPredio}
                            info={selectTipoPredio} esSalo={esSalo} tipoGeometria={tipoGeometria}
                            anios={anios} setCargador={setLoading} capa={filtrosCapas.filter(item => item.id == nivelCapa)[0]} />}
                    {tipoModal === 'I' && infoPredio.gid != undefined &&
                        <div className='table-responsive'>
                            <table className='table table-transparent text-light table-sm table-bordered border-light'>
                                <thead className='text-center'>
                                    <tr>
                                        <th style={{ width: '140px' }}> </th>
                                        <th style={{ width: '140px' }}>Valor</th>
                                    </tr>
                                </thead>
                                {tipoPredio == 'SWC' && <tbody>
                                    {nivelCapa == '3' &&
                                        <tr>
                                            <th>ID Utb</th>
                                            <td>{infoPredio.gid}</td>
                                        </tr>
                                    }
                                    {['2', '3'].includes(nivelCapa) == true &&
                                        <tr>
                                            <th>ID Paño</th>
                                            <td>{infoPredio.n_id_pano}</td>
                                        </tr>}
                                    <tr>
                                        <th>Codigo Fundo</th>
                                        <td>{infoPredio.n_cod_fund == undefined ? infoPredio.cod_fundo : infoPredio.n_cod_fund}</td>
                                    </tr>
                                    <tr>
                                        <th>Rodal</th>
                                        <td>{infoPredio.n_cod_roda == undefined ? infoPredio.cod_rodal : infoPredio.n_cod_roda}</td>
                                    </tr>
                                    <tr>
                                        <th>Nombre</th>
                                        <td>{infoPredio.c_nom_fund}</td>
                                    </tr>
                                    <tr>
                                        <th>Faena</th>
                                        <td>{infoPredio.c_dsc_faen}</td>
                                    </tr>
                                    <tr>
                                        <th>UPR</th>
                                        <td>{infoPredio.n_id_upr}</td>
                                    </tr>
                                    <tr>
                                        <th>UPF</th>
                                        <td>{infoPredio.n_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Area (has)</th>
                                        <td>{nivelCapa == '3' ? infoPredio.f_sup_ha_u.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : parseFloat(infoPredio.f_sup_ha_u).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                    <tr>
                                        <th>Id</th>
                                        <td>{infoPredio.gid}</td>
                                    </tr>
                                </tbody>}
                                {tipoPredio == 'TEMP' &&
                                    <tbody>
                                        <tr>
                                            <th>Codigo Fundo</th>
                                            <td>{infoPredio.cod_fundo}</td>
                                        </tr>
                                        <tr>
                                            <th>Rodal</th>
                                            <td>{infoPredio.cod_rodal}</td>
                                        </tr>
                                        <tr>
                                            <th>UP</th>
                                            <td>{infoPredio.id_up}</td>
                                        </tr>
                                        <tr>
                                            <th>Especie</th>
                                            <td>{infoPredio.especie}</td>
                                        </tr>
                                        <tr>
                                            <th>Empresa</th>
                                            <td>{infoPredio.empresa_pl}</td>
                                        </tr>
                                        <tr>
                                            <th>Ingeniero</th>
                                            <td>{infoPredio.ingenierio}</td>
                                        </tr>
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Clase</th>
                                                <td>{infoPredio.class_utb}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Fecha Vuelo</th>
                                                <td>{getDateFormat(infoPredio.fecha_vuel)}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Densidad</th>
                                                <td>{infoPredio.densidad}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Replante</th>
                                                <td>{infoPredio.replante}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Secas</th>
                                                <td>{infoPredio.secas}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Faltantes</th>
                                                <td>{infoPredio.faltantes}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Ideal</th>
                                                <td>{infoPredio.ideal}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Crecimiento</th>
                                                <td>{infoPredio.crecimient}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Superficie Util</th>
                                                <td>{getDateFormat(infoPredio.fecha_vuel)}</td>
                                            </tr>}
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Fecha Carga</th>
                                                <td>{getDateFormat(infoPredio.fecha_carg)}</td>
                                            </tr>}
                                        <tr>
                                            <th>UPR</th>
                                            <td>{infoPredio.id_upr}</td>
                                        </tr>
                                        <tr>
                                            <th>UPF</th>
                                            <td>{infoPredio.id_upf}</td>
                                        </tr>
                                        {nivelCapa == 3 &&
                                            <tr>
                                                <th>Clase Uso</th>
                                                <td>{infoPredio.class_uso}</td>
                                            </tr>}
                                        <tr>
                                            <th>Id</th>
                                            <td>{infoPredio.gid}</td>
                                        </tr>
                                    </tbody>}
                            </table>
                            {infoDefo != null &&
                                <div className='py-2'>
                                    <div className='text-light fw-bold'>Area Deforestada</div>
                                    <div className='text-center'>
                                        <div className='text-light'>Area Total: {infoDefo.areaTotal.toFixed(3)} km2 </div>
                                    </div>
                                </div>}
                            {esSalo && <button className='btn btn-sm btn-secondary' onClick={() => {
                                var nombre = saloWms.filter(item => item.id == tipoPredio)[0]
                                setSelectFeature(true);
                                setSelectTipoPredio(nombre)
                                setTituloModal("Estadísticas " + nombre.nombre + ' ' + filtroFundoRiego)
                                setTipoModal('E');
                                setShowModal(true);
                            }}>Ver Estadísticas</button>}
                        </div>}
                    {tipoModal === 'T' && infoPredio.fid != undefined &&
                        <div>
                            <div className='table-responsive'>
                                <table className='table table-transparent text-light table-sm table-bordered border-light'>
                                    <thead className='text-center'>
                                        <tr>
                                            <th style={{ width: '140px' }}> </th>
                                            <th style={{ width: '140px' }}>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Area</th>
                                            <td>{decodeISO(infoPredio.calif)}</td>
                                        </tr>
                                        <tr>
                                            <th>Clasificacion</th>
                                            <td>{decodeISO(infoPredio.clasif)}</td>
                                        </tr>
                                        <tr>
                                            <th>Estado</th>
                                            <td>{infoPredio.is_active == "1" ? 'ACTIVO' : 'INACTIVO'}</td>
                                        </tr>
                                        <tr>
                                            <th>Id</th>
                                            <td>{infoPredio.fid}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <a className='text-light fw-bold d-none' target='_blank'
                                href={`https://am-pilot.sinergise.com/browser-app?scope=BO21&markerContext=BO21.MARKER_CONTEXT.1318&type=BO21.CL_FOI.AP&inputId=BO21.FOI.${infoPredio.fid}&dateFrom=2021-03-01&dateTo=2021-10-01`}>Seguir enlace para más detalle</a>
                        </div>}
                    {tipoModal === 'X' && infoPredio.fid != undefined &&
                        <div>
                            <div className='table-responsive'>
                                <table className='table table-transparent text-light table-sm table-bordered border-light'>
                                    <thead className='text-center'>
                                        <tr>
                                            <th style={{ width: '140px' }}> </th>
                                            <th style={{ width: '140px' }}>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Area</th>
                                            <td>{decodeISO(infoPredio.inra_calif)}</td>
                                        </tr>
                                        <tr>
                                            <th>Clasificación</th>
                                            <td>{decodeISO(infoPredio.inra_clasi)}</td>
                                        </tr>
                                        <tr>
                                            <th>Estado</th>
                                            <td>{infoPredio.is_active == true ? 'ACTIVO' : 'INACTIVO'}</td>
                                        </tr>
                                        <tr>
                                            <th>Campos</th>
                                            <td>{infoPredio.number_of_}</td>
                                        </tr>
                                        <tr>
                                            <th>Campos Activos</th>
                                            <td>{infoPredio.number_o_1}</td>
                                        </tr>
                                        <tr>
                                            <th>Id</th>
                                            <td>{infoPredio.fid}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>}
                    {tipoModal === 'B' && <BusquedaPredio collback={(valor) => { mostrarPredio(valor) }} />}
                    {tipoModal === 'C' && predioCaminoSe !== null &&
                        <div>
                            <div className='table-responsive'>
                                <table className='table table-transparent text-light table-sm table-bordered border-light'>
                                    <thead className='text-center'>
                                        <tr>
                                            <th style={{ width: '160px' }}></th>
                                            <th style={{ width: '170px' }}>Valor</th>
                                            <th style={{ width: '160px' }}></th>
                                            <th style={{ width: '170px' }}>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Fecha</th>
                                            <td>{getDateFormat(predioCaminoSe.date)}</td>
                                            <th>Area</th>
                                            <td>{predioCaminoSe.object_area_m2.toFixed(3)} m2</td>
                                        </tr>
                                        <tr>
                                            <th>Fecha Obs</th>
                                            <td>{getDateFormat(predioCaminoSe.observed)}</td>
                                            <th>Puntuacion</th>
                                            <td>{predioCaminoSe.score.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <MapaComparable info={predioCaminoSe} geometry={geometriaCamino} />
                        </div>}
                    {tipoModal === 'S' && <ParametroSuscripcion info={featuresNuevos} collback={(info) => crearSuscripcionPlanet(info)} />}
                    {tipoModal === 'D' && <OpcionesDescarga geometria={geometria} descargarImagen={descargarImagen} selectTipo={selectTipoPredio} getGeometria={getGeometriaGeneral} anios={anios} />}
                    {tipoModal === 'H' && <OpcionesDescargaImages getGeometria={getGeometriaGeneral} descargarImagen={descargarImagenHD} />}
                    {tipoModal === 'A' &&
                        <div className='text-center'>
                            <div className='text-light'>Area Total: {infoDefo.areaTotal.toFixed(3)} km2 </div>
                        </div>}
                    {tipoModal === 'F' &&
                        <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => decargarGeojson()}>Descargar GEOJSON</button>
                        </div>}
                    {tipoModal === 'Z' &&
                        <div className='text-center'>
                            <div className='mb-2'><button className='btn btn-secondary' onClick={() => decargarGeojson()}>Descargar GEOJSON</button></div>
                            <div><button className='btn btn-secondary' onClick={() => decargarShapefile()}>Descargar SHAPEFILE</button></div>
                        </div>}
                    {tipoModal === 'W' && <VistaCatastral geometria={geometria} areas={listaAreasTrabajadas} infoPredio={infoPredio} />}
                </Modal.Body>
            </Modal>
            <Modal show={showModalDe}
                onHide={() => setShowModalDe(false)}
                size={"sm"}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-gradient bg-dark text-light'
                centered>
                <Modal.Header closeButton>
                    <h5>{tituloModal} Deforestación</h5>
                </Modal.Header>
                <Modal.Body>
                    {infoPredioDe != null &&
                        <div className='table-responsive'>
                            <table className='table table-transparent text-light table-sm table-bordered border-light'>
                                <thead className='text-center'>
                                    <tr>
                                        <th style={{ width: '140px' }}> </th>
                                        <th style={{ width: '140px' }}>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>Id</th>
                                        <td>{infoPredioDe.gid}</td>
                                    </tr>
                                    <tr>
                                        <th>Area (has)</th>
                                        <td>{infoPredioDe.area}</td>
                                    </tr>
                                    <tr>
                                        <th>Comparación</th>
                                        <td>{infoPredioDe.compara}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                </Modal.Body>
            </Modal>
            <Modal show={viewVentana}
                onHide={() => setViewVentana(false)}
                size={"lg"}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-gradient bg-dark text-light'
                centered>
                <Modal.Header closeButton>
                    <h5>Igualacion de campos</h5>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-body m-0 p-0'>
                    <FieldIgualar fieldTabla={fieldTablaCapa} fieldCapa={fieldCapaNueva} collback={(E) => guardarIgualacionDeCampos(E)} />
                </Modal.Body>
            </Modal>
        </>
    )
}
//colocar area siempore en has
/*
Estadisticas de predios grandes , Mensaje predio muy grande o ver de cargar predios pequeños
Mostrar otros datos ejm departamento
cuando cargo con el mismo boton hay problema ---------#2024BoliviaForestry
descarga de salo en blanco
meteoblue ·6001Sajhy·
*/
export default MapContainer
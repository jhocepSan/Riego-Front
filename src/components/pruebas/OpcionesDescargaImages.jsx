import React, { useState } from 'react'
import * as proj from 'ol/proj';
import * as olExtent from 'ol/extent';
import VectorDraw from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';

function OpcionesDescargaImages(props) {
    const { getGeometria, descargarImagen } = props;
    const [fecha, setFecha] = useState('');
    const [nubes, setNubes] = useState(10);
    const [dayback, setDayback] = useState(20);
    const [error, setError] = useState(null);
    function descargarImagenes(tipo) {
        if (fecha != '') {
            var geometria = getGeometria();
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
                        "geometry": geometria
                    }
                ]
            }
            var features = new VectorDraw({
                features: new GeoJSON().readFeatures(data, {
                    dataProjection: data.crs.properties.name,
                    featureProjection: '3857'
                })
            })
            var datos = features.getExtent();
            console.log(features.getExtent());
            console.log(geometria);
            var geo1 = proj.transform([datos[0], datos[1]], 'EPSG:3857', 'EPSG:4326');
            var geo2 = proj.transform([datos[2], datos[3]], 'EPSG:3857', 'EPSG:4326');
            var bbox = geo1[1] + ',' + geo1[0] + ',' + geo2[1] + ',' + geo2[0]
            descargarImagen({ bbox, fecha, nubes, dayback,tipo })
        } else {
            setError({ "error": "Colocar la fecha de la imagen a descargar" })
        }
    }
    return (
        <div className='container-fluid'>
            <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Fecha</span>
                <input type="date" className="form-control form-control-sm"
                    value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Nivel Nubes</span>
                <input type="number" className="form-control form-control-sm"
                    value={nubes} onChange={(e) => setNubes(e.target.value)} />
            </div>
            <div className="input-group input-group-sm mb-3">
                <span className="input-group-text">Dias Atras</span>
                <input type="number" className="form-control form-control-sm"
                    value={dayback} onChange={(e) => setDayback(e.target.value)} />
            </div>
            <div className='row row-cols-2 gx-1'>
                <div className='col'>
                    <button className='btn btn-sm btn-success w-100' onClick={() => descargarImagenes('IMG')}>
                        Descargar PNG
                    </button>
                </div>
                <div className='col'>
                    <button className='btn btn-sm btn-success w-100' onClick={() => descargarImagenes('TIFF')}>
                        Descargar TIFF
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OpcionesDescargaImages

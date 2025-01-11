import React, { useEffect, useState } from 'react'
import TileLayer from 'ol/layer/Tile';
import Image from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';

function TreeLayer(props) {
    const { mapa, collback, actualizar,tipoPagina } = props;
    const [listaLayer, setListaLayer] = useState([]);
    const [load, setLoad] = useState(false);
    function getUrlFoto(capa) {
        if (capa instanceof TileLayer) {
            return capa.values_.legendUrl
        } else if (capa instanceof Image) {
            return capa.getSource().getLegendUrl(mapa.current.getView().getResolution(), { 'transparent': true })
        } else if (capa instanceof VectorLayer) {
            return capa.values_.legendUrl
        }
    }
    useEffect(() => {
        //console.log(tipoPagina);
        var listaAx = []
        mapa.current.getLayers().forEach(function (layer) {
            if (layer instanceof TileLayer) {
                if(layer.values_.text=="Mapa HD" && tipoPagina!=='4000'){
                    listaAx.push(layer)
                }else if(layer.values_.text!=="Mapa HD"){
                    listaAx.push(layer)
                }
            } else if (layer instanceof Image) {
                if(!['seleccion'].includes(layer.values_.text)){
                    listaAx.push(layer)
                }
            } else if (layer instanceof VectorLayer) {
                listaAx.push(layer)
            }
        })
        setListaLayer(listaAx);
    }, [actualizar, load])
    return (
        <div className='overflow-auto' style={{maxHeight:'300px',minWidth:'230px',maxWidth:'290px'}}>
        <ul className="list-group">
            {listaLayer.map((item, index) => {
                return (
                    <li className="list-group-item bg-transparent m-1 p-1 grupoListGroup" key={index}>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                checked={item.getVisible()} onChange={(e) => { collback(item.values_.text, e.target.checked); setLoad(!load) }} />
                            <label className="form-check-label text-light" >
                                {item.values_.title}&nbsp;&nbsp;
                                <img src={getUrlFoto(item)} width={20}>
                                </img>
                            </label>
                        </div>
                        {item.getVisible()==true&&<div className='text-end'>
                            {item.values_.text=='Predios'&&<img src={getUrlFoto(item)} width={180} height={80}>
                            </img>}
                            {item.values_.text!='Predios'&&<img src={getUrlFoto(item)} width={100}>
                            </img>}
                        </div>}
                    </li>
                )
            })}
        </ul>
        </div>
    )
}

export default TreeLayer
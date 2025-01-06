import React, { useEffect, useState } from 'react'
import 'color-legend-element';
import MsgUtils from '../Utils/MsgUtils';
import { serverUrl } from '../Utils/UtilsAplication';

function PrincipalLegend(props) {
    const { tipoPredio } = props;
    const [infoLegend, setInfoLegend] = useState([]);
    const [load,setLoad] = useState(false);
    const [tipo,setTipo]=useState(false)
    function getInfoLegendas() {
        fetch(`${serverUrl}/sentinelap/getInfoLegend`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({})
        })
            .then((res) => res.json())
            .then(data => {
                console.log(data.ok)
                if (data.ok) {
                    setLoad(true);
                    setInfoLegend(data.ok);
                } else {
                    setLoad(false);
                    MsgUtils.msgError(data.error);
                }
            })
    }
    function getInfoLegendTipoPredio(tipo) {
        var dato = infoLegend.filter(item => item.id == tipoPredio);
        if (dato.length !== 0) {
            if (tipo !== 'colores') {
                return dato[0][tipo]
            } else {
                var dats = dato[0][tipo].replace(/'/g, '"')
                return dats
            }
        } else {
            return ""
        }
    }
    useEffect(() => {
        setLoad(false)
        //if (infoLegend.length == 0) {
            getInfoLegendas()
        //}else{
        //    setLoad(true);
        //}
    }, [tipoPredio])
    return (
        <>
        {load==false&&<div className='text-center'><i className="fa-solid fa-spinner fa-spin fa-2xl"></i></div>}
        {load==true&&<div className='container-fluid ' > 
            {getInfoLegendTipoPredio('tipo')==true&&getInfoLegendTipoPredio('colores')!='[]'&&<color-legend 
                width="300"
                className="continuous-with-interpolator "
                titletext={getInfoLegendTipoPredio('titulo')}
                range={getInfoLegendTipoPredio('colores')}
                domain={getInfoLegendTipoPredio('rango')}
                tickFormat=".1f"
                tickValues={getInfoLegendTipoPredio('valor')}
            ></color-legend>}
            {getInfoLegendTipoPredio('tipo')==false&&getInfoLegendTipoPredio('colores')!='[]'&&<color-legend
                width="300"
                className="continuous-with-interpolator"
                titletext={getInfoLegendTipoPredio('titulo')}
                range={getInfoLegendTipoPredio('colores')}
                domain={getInfoLegendTipoPredio('rango')}
                tickFormat=".0f"
                tickValues={getInfoLegendTipoPredio('valor')}
            ></color-legend>}
            <div className='px-1 py-1 colorFondoModal' style={{width:'307px'}}>
                <textarea disabled className="form-control" 
                    value={getInfoLegendTipoPredio('descripcion').toString("utf8")} 
                    style={{height:'70px',fontSize:'12px'}}></textarea>
                <div className='btn-group-sm btn-group'>
                <a href={getInfoLegendTipoPredio('link')} target='_blanck' className='btn btn-sm btn-transparent text-light'>Descripción</a>
                <a href={getInfoLegendTipoPredio('link2')} target='_blanck' className='btn btn-sm btn-transparent text-light'>Info. Técnica</a></div>
            </div>
        </div>}
        </>
    )
}

export default PrincipalLegend

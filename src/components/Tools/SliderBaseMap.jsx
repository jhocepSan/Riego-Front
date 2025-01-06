import React, { useEffect, useState } from 'react'
import { Slider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function SliderBaseMap(props) {
    const {fechas,collback,gestion}= props;
    const [dates,setDates] = useState([]);
    const [aux,setAux] = useState([]);
    function getNombreFecha(item){
        var nombre = item.name.split('_');
        var nombref = nombre[4]
        return nombref
    }
    useEffect(()=>{
        if(gestion==''){
            setDates(fechas.map(item=>getNombreFecha(item,0)))
            var auxi=[]
            var cont=0;
            for( var dat in fechas){
                auxi.push(cont);
                cont+=1;
            }
            setAux(auxi);
        }else{
            var datos = fechas.filter((item)=>item.name.split('_')[4].split('-')[0]==gestion)
            setDates(datos.map(item=>getNombreFecha(item,0)))
            var auxi=[]
            var cont=0;
            for( var dat in datos){
                auxi.push(cont);
                cont+=1;
            }
            setAux(auxi);
        }
    },[fechas,gestion])
    return (
        <Slider
            defaultValue={dates.length-1}
            step={1}
            graduated
            min={0}
            max={dates.length - 1}
            renderTooltip={mark => {
                if (aux.includes(mark)) {
                    return <span className='text-light fw-bold' style={{fontSize:'18px'}}>{dates[mark]}</span>;
                }
                return null;
            }}
            renderMark={mark => {
                if (aux.includes(mark)) {
                    return <span className='text-light fw-bold' style={{ fontSize: '11px' }}>{dates[mark]}</span>;
                }
                return null;
            }}
            onChange={(e) => collback(e)}
        />
    )
}

export default SliderBaseMap

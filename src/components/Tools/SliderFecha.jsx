import React, { useEffect, useState } from 'react'
import { Slider } from 'rsuite';
import { getYearFormat,getFechaConvertMin,getFechaConvertFull, getFechaMinimo} from '../Utils/DateConverter.js'
import 'rsuite/dist/rsuite.min.css';

function SliderFecha(props) {
    const {fechas,tipo,selectTipoPredio,collback}=props;
    const [dates,setDates] = useState([]);
    const [dateInfo,setDateInfo] = useState([]);
    const [aux,setAux] = useState([]);
    const [value,setValue] = useState(0);
    useEffect(()=>{
        //console.log(fechas)
        if(selectTipoPredio!=undefined && selectTipoPredio.id!='CB-DISPLAY'){
            setDates(fechas.map(item=>tipo=='S'?getFechaConvertFull(item,0):getYearFormat(item,0)));
        }else{
            setDates(fechas.map(item=>getFechaMinimo(item)));
        }
        setDateInfo(fechas.map(item=>getFechaConvertFull(item,0)));
        setValue(fechas.length-1)
        var auxi=[]
        var cont=0;
        for( var dat in fechas){
            auxi.push(cont);
            cont+=1;
        }
        setAux(auxi);
    },[fechas])
    
    return (
        <Slider
            progressColor="white"
            defaultValue={value}
            value={value}
            step={1}
            graduated
            renderTooltip={mark => {
                if (aux.includes(mark)) {
                    return <span className='text-light fw-bold' style={{fontSize:'18px'}}>{dateInfo[mark]}</span>;
                }
                return null;
            }}
            tooltip={true}
            min={0}
            max={fechas.length-1}
            renderMark={mark => {
                if (aux.includes(mark)) {
                    return <span className='text-light fw-bold' style={{fontSize:'12px'}}>{dates[mark]}</span>;
                }
                return null;
            }}
            onChange={(e) => {setValue(e);collback(e);}}
        />
    )
}

export default SliderFecha

import React, { useEffect, useState } from 'react'
import { DatePicker } from 'rsuite';
import MsgUtils from '../Utils/MsgUtils';
function ParametroSuscripcion(props) {
    const {info,collback} = props;
    const [fechaIni,setFechaIni] = useState('');
    const [fechaFin,setFechaFin] = useState('');
    function sendInformacion(){
        if(fechaIni!=''&&fechaFin!=''){
            console.log(fechaIni,fechaFin)
            collback({'fechaIni':new Date(fechaIni).toISOString(),'fechaFin':new Date(fechaFin).toISOString()})
        }else{
            MsgUtils.msgError("Colocar las dos fechas, Para crear la suscripcion")
        }
    }
    useEffect(()=>{

    },[])
    return (
        <div>
            <div className='row row-cols gx-1 g-1'>
                <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                    <div className="text-light ">Fecha Ini</div>
                    <DatePicker format="dd/MM/yyyy" shouldDisableDate={(date) => {
                        const today = new Date();
                        return false// date > today;
                    }}
                        onChange={(e) => setFechaIni(e)}
                        style={{ minWidth: '150px', maxWidth: '150px' }} />
                </div>
                <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                    <div className="text-light ">Fecha Fin</div>
                    <DatePicker format="dd/MM/yyyy" shouldDisableDate={(date) => {
                        const today = new Date();
                        return false//date > today;
                    }} 
                        onChange={(e) => setFechaFin(e)}
                        style={{ minWidth: '150px', maxWidth: '150px' }} />
                </div>
            </div>
            <div className='w-100 my-2' onClick={()=>sendInformacion()}>
                <button className='w-100 btn btn-sm btn-secondary bg-gradient'>Crear Suscripción</button>
            </div>
        </div>
    )
}

export default ParametroSuscripcion

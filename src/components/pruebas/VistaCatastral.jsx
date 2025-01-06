import React, { useEffect } from 'react'
import MapaCatastral from './MapaCatastral';
import { getFechaDMA } from '../Utils/DateConverter'
import { fixEncoding, decodeISO } from '../Utils/UtilsAplication'
function VistaCatastral(props) {
    const { geometria, areas, infoPredio } = props;
    useEffect(() => {
        console.log(areas);
    }, [])
    return (
        <div className='container-fluid'>
            <div className='row row-cols g-1'>
                <div className='col' style={{ minWidth: '220px', maxWidth: '220px' }}>
                    <span class="badge bg-light text-dark mb-2 w-100" style={{ fontSize: '14px' }}>AREA: {`${decodeISO(infoPredio.inra_calif)}`}</span>
                    <span class="badge bg-light text-dark mb-2 w-100" style={{ fontSize: '14px' }}>CLASIFICACIÓN: {`${decodeISO(infoPredio.inra_clasi)}`}</span>
                    <span class="badge bg-light text-dark mb-2 w-100" style={{ fontSize: '14px' }}>ESTADO: {`${infoPredio.is_active == true ? 'ACTIVO' : 'INACTIVO'}`}</span>
                </div>
                <div className='col' style={{ minWidth: '220px', maxWidth: '220px' }}>
                    <span class="badge bg-light text-dark mb-2 w-100" style={{ fontSize: '14px' }}>CAMPOS: {`${decodeISO(infoPredio.number_of_)}`}</span>
                    <span class="badge bg-light text-dark mb-2 w-100" style={{ fontSize: '14px' }}>CAMPOS ACTIVOS: {`${decodeISO(infoPredio.number_o_1)}`}</span>
                    <span class="badge bg-light text-dark mb-2 w-100" style={{ fontSize: '14px' }}>ID: {`${infoPredio.number_o_1}`}</span>
                </div>
            </div>
            <div className='row row-cols-2 g-2'>
                {areas.map((item, index) => {
                    return (
                        <div className='col-6' key={index}>
                            <div className='text-center fw-bold'>
                                {`${getFechaDMA(item.fecha_ini, 0)} - ${getFechaDMA(item.fecha_fin, 0)}`}
                            </div>
                            <MapaCatastral data={geometria} capa={item.layer_name} infoPredio={infoPredio} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default VistaCatastral

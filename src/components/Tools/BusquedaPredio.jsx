import React, { useState } from 'react'
import { serverUrl } from '../Utils/UtilsAplication.js';
import MsgUtils from '../Utils/MsgUtils';

function BusquedaPredio(props) {
    const {collback} = props;
    const [buscar, setBuscar] = useState('');
    const [predios, setPredios] = useState([]);
    function buscarPredio() {
        if (buscar != '') {
            fetch(`${serverUrl}/usuario/searchPredio`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'nombre': buscar })
            })
                .then((res) => res.json())
                .then(data => {
                    if (data.ok) {
                        console.log(data.ok);
                        setPredios(data.ok);
                    } else {
                        console.log(data.error);
                        MsgUtils.msgError(data.error);
                    }
                })
        } else {
            MsgUtils.msgError("Ingrese informacion para la busqueda")
        }
    }
    return (
        <div>
            <div className="input-group input-group-sm mb-3">
                <span className="mx-2 my-auto text-light" id="basic-addon1">Buscar Predio</span>
                <input type="text" className="form-control form-control-sm"
                    placeholder="nombre/idpredio" value={buscar} onChange={(e) => setBuscar(e.target.value.toUpperCase())} />
                <button className='btn btn-sm botonOscuro' onClick={() => buscarPredio()}><i className="fa-solid fa-magnifying-glass"></i> Buscar</button>
            </div>
            <div className='table-responsive overflow-auto'>
                <table className='table table-dark bg-gradient table-sm table-bordered border-light table-hover table-striped'>
                    <thead className='text-center'>
                        <tr>
                            <th style={{ width: '140px' }}>ID</th>
                            <th style={{ width: '140px' }}>Departamento</th>
                            <th style={{ width: '140px' }}>Clasificación</th>
                            <th style={{ width: '140px' }}>Calificación</th>
                            <th style={{ width: '140px' }}>Área (Has)</th>
                            <th style={{ width: '5px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {predios.map((item,index) => {
                            return (
                                <tr key={index}>
                                    <th>{item.id_predio}</th>
                                    <td>{item.departamen}</td>
                                    <td>{item.clasif}</td>
                                    <td>{item.calif}</td>
                                    <td>{item.shape_area!=null?item.shape_area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}</td>
                                    <td>
                                        <div className='btn-group btn-group-sm'>
                                            <button className='btn btn-sm btn-light' onClick={()=>collback(item)}>
                                                <i className="fa-solid fa-eye "></i></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BusquedaPredio

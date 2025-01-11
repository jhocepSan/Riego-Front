import React, { useState } from 'react'
import MsgUtils from '../Utils/MsgUtils';
import RiegoApi from '../Sql/RiegoApi';

function BuscarPredio(props) {
    const { collback } = props;
    const [inputBuscar, setInputBuscar] = useState('');
    const [listaFaenas, setListaFenas] = useState([]);
    const buscarFaena = async () => {
        try {
            if (inputBuscar != '' && inputBuscar != null) {
                var result = await RiegoApi.searchFundo({ 'FUNDO': inputBuscar });
                if (result.ok) {
                    console.log(result.ok)
                    setListaFenas(result.ok);
                } else {
                    MsgUtils.msgError(result.error);
                }
            } else {
                MsgUtils.msgAdvertencia("Coloca lo que quiere buscar, por favor...")
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    return (
        <div className='conternedorPanelIzquierdo vh-100'>
            <div className='container-fluid bg-dark bg-gradient'>
                <div className='row row-cols-3 g-0'>
                    <div className='col-2 text-star'>
                        <button className='btn btn-transparent text-light'
                            title='Cerrar panel del lado izquierdo'
                            onClick={() => collback(0,null)}
                        >
                            <i className="fa-solid fa-circle-xmark fa-xl"></i>
                        </button>
                    </div>
                    <div className='col-8 my-auto text-center'>
                        <div className='text-light fw-bold'>Buscar Faena</div>
                    </div>
                    <div className='col-2'>

                    </div>
                </div>
            </div>
            <div className='container-fluid'>
                <div className="input-group input-group-sm">
                    <span className="input-group-text text-light bg-transparent border-none">Buscar Por:</span>
                    <input type="text" className="form-control form-control-sm"
                        placeholder="Nombre/rodal/cod fundo/upf"
                        value={inputBuscar}
                        onChange={(e) => setInputBuscar(e.target.value.toUpperCase())} />
                    <button className='btn btn-secondary btn-sm'
                        title='Buscar Faena'
                        onClick={() => buscarFaena()}>
                        <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                    </button>
                </div>
            </div>
            <div className='table-responsive' style={{height:'75%'}}>
                <table className="table table-sm table-dark table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Codigo Fundo</th>
                            <th scope="col">Rodal</th>
                            <th scope="col">UPF</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Especie</th>
                            <th scope="col">Faena</th>
                            <th scope="col">Gestión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaFaenas.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th>
                                        <button className='btn btn-sm btn-transparent text-light'
                                            title={`Ver en el mapa el fundo ${item.c_nom_fund}`}
                                            onClick={()=>collback(1,item)}>
                                            <i className="fa-solid fa-eye fa-xl"></i>
                                        </button>
                                    </th>
                                    <td>{item.n_cod_fund}</td>
                                    <td>{item.n_cod_roda}</td>
                                    <td>{item.n_id}</td>
                                    <td>{item.c_nom_fund}</td>
                                    <td>{item.c_dsc_espe}</td>
                                    <td>{item.c_dsc_faen}</td>
                                    <td>{item.c_dsc_agru}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BuscarPredio

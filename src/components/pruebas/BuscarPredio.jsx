import React, { useState } from 'react'
import MsgUtils from '../Utils/MsgUtils';
import RiegoApi from '../Sql/RiegoApi';

function BuscarPredio(props) {
    const { collback } = props;
    const [inputBuscar, setInputBuscar] = useState('');
    const [listaFaenas, setListaFenas] = useState([]);
    const [mostrarInfo,setMostrarInfo] = useState(false);
    const [itemSelet,setItemSelect] = useState(null);
    const buscarFaena = async () => {
        try {
            if (inputBuscar != '' && inputBuscar != null) {
                var result = await RiegoApi.searchFundo({ 'FUNDO': inputBuscar });
                if (result.ok) {
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
                        placeholder="Nombre/rodal/cod fundo/upf/upr"
                        value={inputBuscar}
                        onChange={(e) => setInputBuscar(e.target.value.toUpperCase())} />
                    <button className='btn btn-secondary btn-sm'
                        title='Buscar Faena'
                        onClick={() => buscarFaena()}>
                        <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                    </button>
                </div>
            </div>
            <div className='table-responsive' style={{height:`${mostrarInfo==false?'75%':'50%'}`}}>
                <table className="table table-sm table-dark table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th ></th>
                            <th style={{width:'80px'}}>Código</th>
                            <th style={{width:'90px'}}>Rodal</th>
                            <th style={{width:'100px'}}>UPR</th>
                            <th style={{width:'100px'}}>UPF</th>
                            <th >Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaFaenas.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th>
                                        <button className='btn btn-sm btn-transparent text-light'
                                            title={`Ver en el mapa el fundo ${item.c_nom_fund}`}
                                            onClick={()=>{collback(1,item);setItemSelect(item);setMostrarInfo(true);}}>
                                            <i className="fa-solid fa-eye fa-xl"></i>
                                        </button>
                                    </th>
                                    <td>{item.n_cod_fund}</td>
                                    <td>{item.n_cod_roda}</td>
                                    <td>{item.n_id_upr}</td>
                                    <td>{item.n_id}</td>
                                    <td>{item.c_nom_fund}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {mostrarInfo==true&&
            <div className='p-1'>
                <div className='card bg-dark bg-gradient text-light'>
                    <div className='card-header text-center'>
                        Información Adicional
                    </div>
                    <div className='card-body m-0 p-0'>
                        <div className='row row-cols g-0'>
                            <div className='col lh-sm'>
                                <div>Faena: <span className="text-light fw-bold">{itemSelet.c_dsc_faen}</span></div>
                                <div>UPR: <span className="text-light fw-bold">{itemSelet.n_id_upr}</span></div>
                                <div>UPF: <span className="text-light fw-bold">{itemSelet.n_id}</span></div>
                            </div>
                            <div className='col lh-sm'>
                                <div>Id: <span className="text-light fw-bold">{itemSelet.gid}</span></div>
                                <div>Area (has) <span  className="text-light fw-bold">{parseInt(itemSelet.f_sup_ha_u).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></div>
                                <div>Especie: <span className="text-light fw-bold">{itemSelet.c_dsc_espe}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className='card-footer'>
                        <button className='btn btn-sm btn-secondary bg-gradient'
                            title='Ver las estadisticas del predio Seleccionado' onClick={()=>collback(3,itemSelet)}>
                            Ver Estadisticas
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default BuscarPredio

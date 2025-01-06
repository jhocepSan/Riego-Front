import React, { useContext, useState } from 'react'
import { DatePicker } from 'rsuite';
import Nav from 'react-bootstrap/Nav';
import { serverUrl } from '../Utils/UtilsAplication';
import { ContextAplications } from '../../App';
import SentinelApi from '../Sql/SentinelApi.js';
import MsgUtils from '../Utils/MsgUtils';

function OpcionesDescarga(pros) {
    const { setLoading } = useContext(ContextAplications);
    const { descargarImagen, selectTipo, geometria, getGeometria, anios } = pros;
    const [viewTab, setViewTab] = useState(0);
    const [fechas, setFechas] = useState([]);
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [periodo,setPeriodo] = useState('P1D');
    const getInformacionPredio = async () => {
        //console.log(selectTipo)
        if (fechaIni != '' && fechaFin != '') {
            setLoading(true);
            if (selectTipo.id != 'Agua Suelo') {
                var geom = getGeometria();
                fetch(`${serverUrl}/sentinelap/getInfoPredio`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(
                        { 'geometria':geom, 'id': selectTipo.idColection, 
                        'fechaI': selectTipo.fecha == true ? fechaIni : `${fechaIni}-01-01`, 
                        'fechaF': selectTipo.fecha == true ? fechaFin : `${fechaFin}-12-25` })
                })
                    .then((res) => res.json())
                    .then(data => {
                        setLoading(false);
                        //console.log(data.ok)
                        if (data.ok) {
                            if (data.ok.length != 0) {
                                var listaFiltrada = [...new Set(data.ok.map(item => new Date(item).toISOString().substring(0, 10)))]
                                //console.log(listaFiltrada);
                                setFechas(listaFiltrada);
                            } else {
                                setFechas([]);
                                MsgUtils.msgAdvertencia("No hay Imagenes Disponibles ...");
                            }
                        } else {
                            MsgUtils.msgError(data.error)
                        }
                    })
            } else {
                var geom = getGeometria();
                var datos = await SentinelApi.getEstadisticasPredio(
                    {
                        'geometry': geom, 'tipoPredio': selectTipo.id,
                        'fechaIni': selectTipo.fecha == true ? fechaIni : `${fechaIni}-01-01`,
                        'fechaFin': selectTipo.fecha == true ? fechaFin : `${fechaFin}-12-25`,
                        'id': selectTipo.idColection, 'periodo': periodo
                    })
                if (datos.ok) {
                    var infor = datos.ok.data.filter(item => item.outputs.index.bands.B0.stats.min != 'NaN');
                    setFechas(infor.map(item => item.interval));
                } else {
                    setFechas([]);
                    MsgUtils.msgError(datos.error)
                };
                setLoading(false);
            }
        } else {
            MsgUtils.msgAdvertencia("Elija las fechas para la Busqueda")
        }
    }
    function descargarRangoImagen(tipo) {
        for (var dt of fechas) {
            descargarImagen(tipo, dt);
        }
    }
    return (
        <div>
            <Nav variant="tabs" defaultActiveKey={viewTab} onSelect={(e) => setViewTab(e)}>
                <Nav.Item>
                    <Nav.Link eventKey={0}><span className={`${viewTab == 0 ? 'text-dark' : 'text-light'} fw-bold`}><i className="fa-solid fa-chart-line"></i> Una Fecha</span></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={1}><span className={`${viewTab == 1 ? 'text-dark' : 'text-light'} fw-bold`}><i className="fa-solid fa-chart-column"></i> Rango Fechas</span></Nav.Link>
                </Nav.Item>
            </Nav>
            {viewTab == 0 &&
                <div className='container-fluid py-2'>
                    <div className='row row-cols-2 gx-1'>
                        <div className='col'>
                            <button className='btn btn-sm btn-secondary w-100' onClick={() => descargarImagen('V', null)}>Visualización</button>
                        </div>
                        {selectTipo.id!=='1_TRUE-COLOR'&&<div className='col'>
                            <button className='btn btn-sm btn-secondary w-100' onClick={() => descargarImagen('A', null)}>Analitico</button>
                        </div>}
                    </div>
                </div>}
            {viewTab == 1 &&
                <div className='container-fluid py-2'>
                    <div className='text-light fw-bold'>Se descargara las fotos disponibles de las geometria Seleccionada</div>
                    <hr className='m-1 p-0'></hr>
                    <div className='mb-2'>
                        {selectTipo.fecha == true && <div className="text-light ">Fecha Inicio</div>}
                        {selectTipo.fecha == false && <div className="text-light ">Año Ini</div>}
                        {selectTipo.fecha == true && <DatePicker format="dd/MM/yyyy" shouldDisableDate={(date) => {
                            const today = new Date();
                            return date > today;
                        }}
                            onChange={(e) => setFechaIni(e)}
                            style={{ minWidth: '150px', maxWidth: '250px' }} />}
                        {selectTipo.fecha == false &&
                            <select className="form-select form-select-sm" value={fechaIni}
                                style={{ minWidth: '150px', maxWidth: '250px' }}
                                onChange={(e) => setFechaIni(e.target.value)}>
                                <option selected >Ninguno</option>
                                {anios.map((item, index) => {
                                    return (<option value={item} key={index}>{item}</option>)
                                })}
                            </select>
                        }
                        {selectTipo.fecha == true && <div className="text-light ">Fecha Final</div>}
                        {selectTipo.fecha == false && <div className="text-light ">Año Ini</div>}
                        {selectTipo.fecha == true && <DatePicker format="dd/MM/yyyy" shouldDisableDate={(date) => {
                            const today = new Date();
                            return date > today;
                        }}
                            onChange={(e) => setFechaFin(e)}
                            style={{ minWidth: '150px', maxWidth: '250px' }} />}
                        {selectTipo.fecha == false &&
                            <select className="form-select form-select-sm" value={fechaFin}
                                style={{ minWidth: '150px', maxWidth: '250px' }}
                                onChange={(e) => setFechaFin(e.target.value)}>
                                <option selected >Ninguno</option>
                                {anios.map((item, index) => {
                                    return (<option value={item} key={index}>{item}</option>)
                                })}
                            </select>
                        }
                        {false&&<div className='my-2'>
                            <div className="text-light ">Periodicidad</div>
                            <select className="form-select form-select-sm"
                                style={{ minHeight: '35px', maxHeight: '35px' }}
                                defaultValue={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}>
                                <option value={'P1D'}>Diario</option>
                                <option value={'P7D'}>Semanal</option>
                                <option value={'P15D'}>Quincenal</option>
                                <option value={'P1M'}>Mensual</option>
                                <option value={'P3M'}>Trimestral</option>
                                <option value={'P1Y'}>ANUAL</option>
                            </select>
                        </div>}
                    </div>
                    {fechas.length == 0 && <button className='btn btn-sm btn-secondary w-100' onClick={() => getInformacionPredio()}>Buscar Imagenes</button>}
                    {fechas.length != 0 &&
                        <div>
                            <spam>Descargaremos {fechas.length} imagenes</spam>
                            <div className='row row-cols-3 gx-1'>
                                <div className='col'>
                                    <button className='btn btn-sm btn-secondary w-100' onClick={() => descargarRangoImagen('V')}>Visual</button>
                                </div>
                                {selectTipo.id!=='1_TRUE-COLOR'&&<div className='col'>
                                    <button className='btn btn-sm btn-secondary w-100' onClick={() => descargarRangoImagen('A')}>Analitico</button>
                                </div>}
                                <div className='col'>
                                    <button className='btn btn-sm btn-danger w-100' onClick={() => setFechas([])}>Descartar</button>
                                </div>
                            </div>
                        </div>}
                </div>}
        </div>
    )
}

export default OpcionesDescarga

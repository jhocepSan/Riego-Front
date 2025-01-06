import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from 'rsuite';
import { getDateFormat, getFechaLiteral } from '../Utils/DateConverter.js';
import Nav from 'react-bootstrap/Nav';
import FileSaver from 'file-saver';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { serverUrl } from '../Utils/UtilsAplication.js'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import MsgUtils from '../Utils/MsgUtils.jsx';
import HistogramaUnidad from './HistogramaUnidad.jsx';
import Modal from 'react-bootstrap/Modal';
import HistogramaGlobal from './HistogramaGlobal.jsx';
import MiniMapaEstadistica from './MiniMapaEstadistica.jsx';
import PlanetApi from '../Sql/PlanetApi.js';
import * as XLSX from 'xlsx';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);
function StadisticShow(props) {
    const { getGeometry, tipoPredio, info, esSalo, tipoGeometria, anios, setCargador } = props;
    const [listas, setListas] = useState([]);
    const [loading, setLoading] = useState(null);
    const [labels, setLabels] = useState([]);
    const [geometry, setGeometry] = useState(null);
    const [dato, setDato] = useState({});
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const refTabla = useRef();
    const refLinea = useRef();
    const [showModal, setShowModal] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [viewTab, setViewTab] = useState(0);
    const [hayDatos, setHayDatos] = useState(false);
    const [fechasImg, setFechasImg] = useState([]);
    const [hoverSelect, setHoverSelect] = useState(null);
    const [periodo, setPeriodo] = useState('P1D');
    const [puntero,setPuntero] = useState(0);
    const [datoHis,setDatoHis] = useState(null);
    function getDatoFiltrado(datos, tipo, valor) {
        if (tipoPredio == 'SWC') {
            return datos.map((item) => item[valor].toFixed(2))
        }
    }
    function getDatoTabla(datos, valor) {
        if (tipoPredio == 'SWC') {
            return datos[valor].toFixed(2)
        }
    }

    function infoPredioSelect(fechaIni, fechaFin) {
        fetch(`${serverUrl}/sentinelap/getInfoPredio`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'geometria': geometry, 'id': info.idColection, 'fechaI': fechaIni, 'fechaF': fechaFin })
        })
            .then((res) => res.json())
            .then(data => {
                //console.log(data)
                if (data.ok) {
                    console.log('infoPredio', data.ok.map(item => new Date(item).toISOString().substring(0, 10)))
                    var listaFiltrada = [...new Set(data.ok.map(item => new Date(item).toISOString().substring(0, 10)))]
                    console.log(listaFiltrada);
                    setFechasImg(listaFiltrada.reverse());
                } else {
                    MsgUtils.msgError(data.error)
                }
                setLoading(false);
            })
    }
    const getInfoStadistic = async () => {
        setFechasImg([]);
        if (fechaIni != '' && fechaFin != '') {
            setLoading(true);
            var fechInin, fechFinn;
            if (info.std == true) {
                var geometria = getGeometry();
                console.log(geometria)
                if (geometria.gid != undefined) {
                    setGeometry(geometria.geometria)
                    var data = await PlanetApi.getStadisticPredio({ 'fechaIni': fechaIni, 'fechaFin': fechaFin, 'gid': geometria.gid });
                    if (data.ok) {
                        console.log(data.ok)
                        if (data.ok.length != 0) {
                            var labe = data.ok.map((item) => getDateFormat(item.fecha))
                            setFechasImg(data.ok)
                            setHayDatos(true);
                            setLabels(labe)
                            setListas(data.ok)
                            setDato({
                                labels: labe,
                                datasets: [
                                    {
                                        label: 'Maximo',
                                        data: getDatoFiltrado(data.ok, '', 'maximo'),
                                        borderColor: 'rgba(25, 99, 232)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        hoverBorderColor: 'rgb(75, 255, 0)',
                                        hoverBackgroundColor: 'rgb(75, 255, 0)',
                                        fill: 1
                                    },
                                    {
                                        label: 'Medio',
                                        data: getDatoFiltrado(data.ok, '', 'promedio'),//infor.map((item) => item.outputs.ndvi.bands.B0.stats.mean.toFixed(2)),
                                        borderColor: 'rgba(153, 0, 153)',
                                        backgroundColor: 'rgba(153, 0, 153)',
                                        hoverBorderColor: 'rgb(75, 255, 0)',
                                        hoverBackgroundColor: 'rgb(75, 255, 0)',
                                    },
                                    {
                                        label: 'Minimo',
                                        data: getDatoFiltrado(data.ok, '', 'minimo'),//infor.map((item) => item.outputs.ndvi.bands.B0.stats.min.toFixed(2)),
                                        borderColor: 'rgba(153, 162, 235)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        hoverBorderColor: 'rgb(75, 255, 0)',
                                        hoverBackgroundColor: 'rgb(75, 255, 0)',
                                        fill: 1
                                    }
                                ],
                            })
                        }
                        setLoading(false);
                    } else {
                        console.log(data.error);
                        setFechasImg([]);
                        setLoading(false);
                        MsgUtils.msgError("Algo inesperado paso, intente mas tarde ...")
                    }
                } else {
                    setGeometry(geometria)
                    var data = await PlanetApi.getStadisticGeometria({ 'fechaIni': fechaIni, 'fechaFin': fechaFin, geometria });
                    if (data.ok) {
                        console.log(data.ok)
                    } else {
                        console.log(data.error);
                        setFechasImg([]);
                        setLoading(false);
                        MsgUtils.msgError("Algo inesperado paso, intente mas tarde ...")
                    }
                }
            } else {
                setLoading(true);
                infoPredioSelect(fechInin, fechFinn)
            }
        } else {
            MsgUtils.msgError("Elija un rango de fecha por favor.")
        }
    }
    function getUnidad() {
        if (tipoPredio == 'CONOPY_HEIGH') {
            return ' [m]'
        } else if (tipoPredio == 'CONOPY_COVER') {
            return ' %'
        } else if (tipoPredio == 'ABOVEGROUND_CARBON_DENSITY') {
            return ' [Mg C/ha]'
        } else if (tipoPredio == 'Agua Suelo') {
            return ' [M3/m3]'
        } else if (tipoPredio == 'CB-DISPLAY') {
            return 'Nivel de Biomasa'
        } else {
            return ''
        }
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    fontColor: '#ffff',
                    color: '#ffff'
                },
                position: 'top',
            },
            title: {
                display: true,
                text: 'Grafica de Estadisticas',
                fontColor: '#ffff',
                color: '#ffff'
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: `${getUnidad()}`,
                    fontColor: '#ffff',
                    color: '#ffff',
                },
                ticks: {
                    color: 'rgba(255, 255, 225)',
                },
                gridLines: {
                    color: "rgba(220, 221, 225)"
                }
            },
            x: {
                ticks: { color: 'rgba(220, 221, 225)' }
            }
        },
        onHover: (event, elements) => {
            if (elements.length > 0) {
                setHoverSelect(elements[0].index);
            } else {
                setHoverSelect(null);
            }
        }
    };
    const descargarDatos = async () => {
        setCargador(true);
        var inform = info;
        for await (var datet of fechasImg) {
            console.log(datet)
            var respuesta = await fetch(`${serverUrl}/sentinelap/descargarFotoPredio`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    'geometria': geometry, 'tipo_predio': tipoPredio,
                    'fecha': datet.to == undefined ? datet : datet.to, 'info': inform, 'tipoImg': 'V', 'fechaI': datet.from == undefined ? datet : datet.from
                })
            })/*.then(data => data.json())
                .then(data => {
                    console.log(data)
                    if (data.ok) {
                        console.log(data.ok)
                        if (true) {
                            FileSaver.saveAs(`${serverUrl}/document/planetimg/${data.ok}`, `${datet.to == undefined ? datet : datet.to.substring(0, 10)}_${info.nombre}.tiff`);
                        } else {
                            FileSaver.saveAs(`${serverUrl}/document/planetimg/${data.ok}`, `${datet.to.substring(0, 10)}_${info.nombre}.tiff`);
                        }
                        MsgUtils.msgCorrecto("Descarga Correcta...")
                    } else {
                        console.log(data.error);
                        MsgUtils.msgError(data.error);
                    }
                }).catch(error => MsgUtils.msgError(error))*/
            respuesta = await respuesta.json()
            console.log(respuesta)
            if (respuesta.ok) {
                console.log(`${datet.to == undefined ? datet : datet.to.substring(0, 10)}_${info.nombre}.tiff`)
                FileSaver.saveAs(`${serverUrl}/document/planetimg/${respuesta.ok}`, `${datet.to == undefined ? datet : datet.to.substring(0, 10)}_${info.nombre}.tiff`);
                MsgUtils.msgCorrecto("Descarga Correcta...")
            } else {
                MsgUtils.msgError(respuesta.error);
            }
        }
        if (info.std == true) {
            var canvasSave = document.getElementById('estadisticaLine');
            canvasSave.toBlob(function (blob) {
                FileSaver.saveAs(blob, `${datet.to == undefined ? datet : datet.to.substring(0, 10)}_${info.nombre}.png`)
            })
        }
        setCargador(false);
    }
    const dateFormatter = date => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };
    const mostrarHistograma=async(valor, index)=>{
        if (tipoPredio == 'SWC') {
            try {
                var dato = await PlanetApi.getHistogramaPredio({'fecha':valor.fecha,'gid':valor.gid_poligono})    
                if(dato.ok){
                    console.log(dato.ok);
                    if(dato.ok.length!==0){
                        setPuntero(index);
                        setSelectItem(dato.ok[0]);
                        setShowModal(true);
                    }else{
                        MsgUtils.msgAdvertencia("No hay INFORMACION")
                    }
                }else{
                    MsgUtils.msgError(data.error);
                }
            } catch (error) {
                MsgUtils.msgError(error)
            }
        }
        
    }
    function cambiarHistograma(valor) {
        console.log(valor)
        if (valor == 'B') {
            if (puntero > 0) {
                mostrarHistograma(listas[puntero - 1], puntero- 1)
            } else {
                MsgUtils.msgAdvertencia("No hay mas Datos Atras")
            }
        } else {
            if (puntero < listas.length - 1) {
                mostrarHistograma(listas[puntero + 1], puntero + 1)
            } else {
                MsgUtils.msgAdvertencia("No hay mas Datos Adelante")
            }
        }
    }
    const hoverMapa = (index) => {
        console.log(index)
        const chartInstance = refLinea.current;

        if (chartInstance) {
            const meta = chartInstance._metasets[0]; // Obtener los metadatos del primer dataset
            const point = meta.data[index]; // Obtener el punto específico (por índice)

            // Simular el evento del mouse en las coordenadas del punto
            const event = new MouseEvent('mousemove', {
                clientX: point.x, // Coordenada X
                clientY: point.y, // Coordenada Y
            });

            chartInstance.canvas.dispatchEvent(event); // Disparar el evento manualmente
        }
    }
    function exportarExcel() {
        var datoFinal=[]
        for (var dato of listas){
            datoFinal.push({
                "FECHA":getDateFormat(dato.fecha),
                "MAXIMO":getDatoTabla(dato, 'maximo'),
                "PROMEDIO":getDatoTabla(dato, 'promedio'),
                "MINIMO":getDatoTabla(dato, 'minimo')
            })
        }
        // Crear una hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(datoFinal);

        // Crear un libro de trabajo y agregar la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ESTADISTICAS');

        // Exportar el archivo
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(dataBlob, 'ESTADISTICAS.xlsx');
    }
    const getHistogramaGlobal=async(valor)=>{
        try {
            var geometria = getGeometry();
            var result = await PlanetApi.getHistogramaGlobalPredio({ 'fechaIni': fechaIni, 'fechaFin': fechaFin, 'gid': geometria.gid });
            if(result.ok){
                console.log(result.ok)
                setDatoHis(result.ok)
                setViewTab(parseInt(valor));
            }else{
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error);
        }
    }
    function cambiarTabGrafico(valor){
        if(valor==0){
            setViewTab(parseInt(valor));
        }else{
            getHistogramaGlobal(valor)
        }
    }
    return (<>
        <div className='container-fluid'>
            <div className='row row-cols gx-1 g-1'>
                <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                    {info.fecha == true && <div className="text-light ">Fecha Ini</div>}
                    {info.fecha == false && <div className="text-light ">Año Ini</div>}
                    {info.fecha == true && <DatePicker format="dd/MM/yyyy" shouldDisableDate={(date) => {
                        const today = new Date();
                        return date > today;
                    }}
                        onChange={(e) => setFechaIni(e)}
                        style={{ minWidth: '150px', maxWidth: '150px' }} />}
                    {info.fecha == false &&
                        <select className="form-select form-select-sm" value={fechaIni} onChange={(e) => setFechaIni(e.target.value)}>
                            <option selected >Ninguno</option>
                            {anios.map((item, index) => {
                                return (<option value={item} key={index}>{item}</option>)
                            })}
                        </select>
                    }
                    {/*<input type="date" className="form-control" value={fechaIni} onChange={(e) => setFechaIni(e.target.value)} />*/}
                </div>
                <div className='col mx-2' style={{ minWidth: '150px', maxWidth: '150px' }}>
                    {info.fecha == true && <div className="text-light ">Fecha Fin</div>}
                    {info.fecha == false && <div className="text-light ">Año Fin</div>}
                    {info.fecha == true && <DatePicker format="dd/MM/yyyy" shouldDisableDate={(date) => {
                        const today = new Date();
                        return date > today;
                    }} //renderValue={dateFormatter}
                        onChange={(e) => setFechaFin(e)}
                        style={{ minWidth: '150px', maxWidth: '150px' }} />}
                    {info.fecha == false &&
                        <select className="form-select form-select-sm" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}>
                            <option selected >Ninguno</option>
                            {anios.map((item, index) => {
                                return (<option value={item} key={index}>{item}</option>)
                            })}
                        </select>
                    }
                </div>
                {info.tipo != undefined && info.tipo != 'S' && <div className='col mx-2' style={{ minWidth: '150px', maxWidth: '150px' }}>
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
                <div className='col' style={{ minWidth: '120px', maxWidth: '120px' }}>
                    <div className='text-dark'>--</div>
                    <button className='btn  btn-success w-100' style={{ minHeight: '35px', maxHeight: '35px' }}
                        onClick={() => getInfoStadistic()}><i className="fa-solid fa-magnifying-glass"></i> Visualizar</button>
                </div>
                {fechasImg.length != 0 &&
                    <div className='col d-none' style={{ minWidth: '120px', maxWidth: '120px' }}>
                        <div className='text-dark'>--</div>
                        <button className='btn btn-secondary w-100 '
                            style={{ minHeight: '35px', maxHeight: '35px' }}
                            onClick={() => descargarDatos()}><i className="fa-solid fa-down-long"></i> Descargar</button>
                    </div>}
            </div>
        </div>
        {loading == true && <div className='text-center'>
            <div><i className="fa-solid fa-spinner fa-spin fa-xl"></i></div>
            <div colspan="5" className='fa-fade'>Espere por favor ...</div>
        </div>}
        {fechasImg.length == 0 && loading == false &&
            <div className='fa-fade py-2 fw-bold container'>Este Predio no Tiene estadisticas, ni fotos ...</div>}
        {fechasImg.length != 0 && <div className='text-center container-fluid py-2'>
            <div> Imagenes Disponibles</div>
            <div className='overflow-auto' style={{ maxHeight: `${info.std == true ? '410px' : '800px'}`, minHeight: '0px' }}>
                <div className='row row-cols gx-2 w-100 g-1'>
                    {fechasImg.map((item, index) => {
                        return (
                            <div className={`col ${hoverSelect == index ? "resaltarCuadro" : ''}`}
                                //onMouseEnter={() => hoverMapa(index)}
                                style={{ maxWidth: '360px', minWidth: '360px' }} key={index}>
                                <div className='text-center text-light'>{info.std == true ? getDateFormat(item.fecha == undefined ? item : item.fecha) : getDateFormat(item.fecha)}</div>
                                <MiniMapaEstadistica fechas={item} geometria={geometry} info={info} 
                                tipoGeometria={tipoGeometria} hoverSelect={hoverSelect} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>}
        {hayDatos == true && <div>
            {loading == false && listas.length != 0 && <div className='w-100 py-2' >
                <Nav variant="tabs" defaultActiveKey={viewTab} onSelect={(e) => cambiarTabGrafico(e)}>
                    <Nav.Item>
                        <Nav.Link eventKey={0}><span className={`${viewTab == 0 ? 'text-dark' : 'text-light'} fw-bold`}>
                            <i className="fa-solid fa-chart-line"></i> Grafica</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={1}><span className={`${viewTab == 1 ? 'text-dark' : 'text-light'} fw-bold`}>
                            <i className="fa-solid fa-chart-column"></i> Histograma</span></Nav.Link>
                    </Nav.Item>
                </Nav>
                {viewTab == 0 && <Line options={options} data={dato} width={window.innerWidth} height='320px' id='estadisticaLine' ref={refLinea} />}
                {viewTab == 1 && esSalo == true && <HistogramaGlobal lista={datoHis} tipoPredio={tipoPredio} info={info} />}
            </div>}
            <div className='table-responsive py-2'>
                <button className='btn btn-success btn-sm' disabled={loading} onClick={() => exportarExcel()}>
                    <i className="fa-solid fa-file-excel"></i> Excel </button>
                <table className="table table-striped table-hover table-dark" ref={refTabla}>
                    <thead>
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Maximo</th>
                            <th scope="col">Medio</th>
                            <th scope="col">Minimo</th>
                            {esSalo == true && <th >Histograma</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {listas.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{getDateFormat(item.fecha)}</th>
                                    <td>{getDatoTabla(item, 'maximo')}</td>
                                    <td>{getDatoTabla(item, 'promedio')}</td>
                                    <td>{getDatoTabla(item, 'minimo')}</td>
                                    {info.histo == true && <td>
                                        <button className='btn btn-sm btn-light' onClick={() => mostrarHistograma(item, index)}>
                                            <i className="fa-solid fa-square-poll-vertical"></i> Histograma
                                        </button>
                                    </td>}
                                </tr>
                            )
                        })}
                        {loading == true &&
                            <tr>
                                <td><i className="fa-solid fa-spinner fa-spin"></i></td>
                                <td><i className="fa-solid fa-spinner fa-spin"></i></td>
                                <td><i className="fa-solid fa-spinner fa-spin"></i></td>
                                <td><i className="fa-solid fa-spinner fa-spin"></i></td>
                                {esSalo == true && <td><i className="fa-solid fa-spinner fa-spin"></i></td>}
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>}
        <Modal show={showModal}
            onHide={() => setShowModal(false)}
            size={"xl"}
            backdrop="static"
            fullscreen={true}
            keyboard={false}
            aria-labelledby="contained-modal-title-vcenter"
            contentClassName='bg-gradient bg-dark text-light'
            centered>
            <Modal.Header closeButton>
                <h5>Histograma</h5>
            </Modal.Header>
            <Modal.Body>
                {selectItem != null && <>
                    <div className='container-fluid mb-2'>
                        <div className='row row-cols gx-1'>
                            <div className='col col-1 text-start'>
                                <button className='btn btn-sm btn-light' onClick={() => { cambiarHistograma('B') }}>
                                    <i className="fa-solid fa-circle-left"></i>
                                </button>
                            </div>
                            <div className='col text-center fw-bold'>
                                <div>{getFechaLiteral(selectItem.fecha)}</div>
                            </div>
                            <div className='col col-1 text-end'>
                                <button className='btn btn-sm btn-light' onClick={() => { cambiarHistograma('N') }}>
                                    <i className="fa-solid fa-circle-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid fw-bold'>
                        <div className='row row-cols gx-1'>
                            <div className='col'>
                                <HistogramaUnidad selectItem={selectItem} tipoPredio={tipoPredio} info={info}/>
                            </div>
                            <div className='col my-auto' style={{ maxWidth: '500px', minWidth: '500px' }}>
                                <MiniMapaEstadistica fechas={selectItem} 
                                    geometria={geometry} info={info} tipoGeometria={tipoGeometria} 
                                    hoverSelect={hoverSelect} />
                            </div>
                        </div>
                    </div>

                </>}
            </Modal.Body>
        </Modal>
    </>
    )
}

export default StadisticShow
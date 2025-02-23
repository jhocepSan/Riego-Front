import React, { useEffect, useRef, useState } from 'react'
import MsgUtils from '../Utils/MsgUtils';
import RiegoApi from '../Sql/RiegoApi';
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
import { getFechaSimpli } from '../Utils/DateConverter.js'
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

function GraficaMensual(props) {
    const { getInfo, capa, selectItem } = props;
    const [dato, setDato] = useState({});
    const [loading, setLoading] = useState(false);
    const refLinea = useRef();
    function generateList(start, end, step) {
        const length = Math.floor((end - start) / step) + 1;
        return Array.from({ length }, (_, i) => (start + i * step).toFixed(2));
    }
    const obtenerDatosMensual = async () => {
        try {
            var infoG = getInfo()
            console.log(infoG)
            var gid
            if (parseInt(capa.id) == 1) {
                gid = infoG.infoPredio.n_id
            } else {
                gid = infoG.infoPredio.n_id_pano
            }
            var fechaliteral = selectItem.fecha.slice(0, 10).split('-');
            var fecha = new Date(fechaliteral[0], fechaliteral[1] - 1, fechaliteral[2])
            var result = await RiegoApi.getEstadisticaMensual({ 'predio': capa.id, 'gid': gid, 'mes': fecha.getMonth() + 1, 'anio': fecha.getFullYear() })
            if (result.ok) {
                var colores = ['#e6f2ff', '#cce6ff', '#b3d9ff', '#99ccff', '#80bfff', '#66b3ff', '#4da6ff', '#3399ff', '#1a8cff', '#0080ff', '#0073e6', '#0066cc', '#0059b3', '#004d99', '#004080', '#003366', '#00264d']
                var label = [...new Set(result.ok.map((item) => item.fecha))]
                var agrupacion = generateList(0.00, 1.0, 0.05).slice(1);
                var datos = result.ok;
                var dataSet = [];
                var cont = 0;
                for (var grup of agrupacion) {
                    var filtrado = datos.filter((item) => (item.valor > (parseFloat(grup) - 0.05) && item.valor <= parseFloat(grup).toFixed(2)))
                    var areas = []
                    for (var fechaL of label) {
                        var filtroFecha = filtrado.filter((item) => item.fecha == fechaL).map(item => parseFloat(item.f_sup_ha_u))
                        var sumado = filtroFecha.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
                        areas.push(sumado.toFixed(2))
                    }
                    var acumuladoTotal = areas.reduce((acumulador, valorActual) => parseFloat(acumulador) + parseFloat(valorActual), 0);
                    if (acumuladoTotal != 0) {
                        dataSet.push({
                            label: `${(parseFloat(grup) - 0.05).toFixed(2)}-${parseFloat(grup).toFixed(2)}`,
                            data: areas,
                            borderColor: colores[cont],
                            backgroundColor: colores[cont],
                            hoverBorderColor: 'rgb(75, 255, 0)',
                            hoverBackgroundColor: 'rgb(75, 255, 0)',
                            /*fill: 1*/
                        })
                    }
                    cont += 1;
                }
                setDato({
                    labels: label.map(item => getFechaSimpli(item)),
                    datasets: dataSet
                })
                setLoading(true);
            } else {
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
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
                display: false,
                text: 'Historico Mensual',
                fontColor: '#ffff',
                color: '#ffff'
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: `Has`,
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
            y1: {
                type: "linear",
                position: "right",
                title: {
                    display: true,
                    text: "Precipitación (mm)",
                    fontColor: '#ffff30',
                    color: '#ffff30',
                },
                ticks: {
                    color: 'rgba(255, 255, 48)',
                },
                grid: {
                    drawOnChartArea: false // Para que la cuadrícula no se superponga con la otra escala
                }
            },
            x: {
                ticks: { color: 'rgba(220, 221, 225)' }
            }
        },
        /*onHover: (event, elements) => {
            if (elements.length > 0) {
                setHoverSelect(elements[0].index);
            } else {
                setHoverSelect(null);
            }
        }*/
    };
    useEffect(() => {
        obtenerDatosMensual()
    }, [selectItem])
    return (
        <div className='container-fluid'>
            {loading == true && <Line options={options} data={dato} width={window.innerWidth} height='300px' id='estadisticaLine' ref={refLinea} />}
        </div>
    )
}

export default GraficaMensual

import React, { useEffect, useRef, useState } from 'react'
import { getYearFormat,getFechaConvertFull } from '../Utils/DateConverter.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function HistogramaGlobal(props) {
    const { tipoPredio, lista,info } = props;
    const [data, setData] = useState({
        labels: [],
        datasets: [
        ]
    });
    const chartc = useRef(null);
    function interpolateColor(color1, color2, factor) {
        if (factor === undefined) factor = 0.5;
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
            //result[i]=Math.round((100-factor)*color1[i]+factor*color2[i])
        }
        return result;
    }

    function rgbToString(rgb) {
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
    function hexToRgb (hexa){
        let r = parseInt(hexa.substring(0,2),16);
        let g = parseInt(hexa.substring(2,4),16);
        let b = parseInt(hexa.substring(4,6),16);
        return [r,g,b]
    }
    function getUnidad() {
        if (tipoPredio == 'CONOPY_HEIGH') {
            return ' Area (Has) por cada tramo (%) de Altura de dosel'
        } else if (tipoPredio == 'CONOPY_COVER') {
            return ' Area (Has) por cada tramo (%) de cobertura de dosel'
        } else if (tipoPredio == 'ABOVEGROUND_CARBON_DENSITY'||tipoPredio == 'ACD-DISPLAY') {
            return ' Area (Has) por cada tramo (%) de densidad de carbono'
        } else if (tipoPredio == 'Agua Suelo') {
            return ' Area (Has) por cada tramo (%) de humedad en el suelo'
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
                /*onClick: (event, legendItem, legend) => {
                    const datasetIndex = legendItem.datasetIndex;
                    const datasetLabel = data.datasets[datasetIndex].label;
                    alert(`Clic en la leyenda: ${datasetLabel}`);
                    // Puedes hacer cualquier acción adicional aquí, como actualizar el estado o manipular datos.
                },*/
            },
            title: {
                display: true,
                text: `${getUnidad()}`,
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
                    color: '#ffff'
                },
                ticks: {
                    color: 'rgba(255, 255, 225)',
                },
                gridLines: {
                    color: "rgba(220, 221, 225)"
                }
            },
            x: {
                title: {
                    display: true,
                    text: `%`,
                    fontColor: '#ffff',
                    color: '#ffff'
                },
                ticks: { color: 'rgba(220, 221, 225)' }
            },
            barThickness: 30,          
            maxBarThickness: 40, 
        }
    }
    const handleClick = (event, chartElement) => {
        if (chartElement.length > 0) {
            const index = chartElement[0].index; // Índice de la barra clicada
            const label = data.labels[index];
            const value = data.datasets[0].data[index];
            alert(`Has clicado en ${label}: ${value} ventas`);
        }
    };
    function generateList(start, end, step) {
        const length = Math.floor((end - start) / step) + 1;
        return Array.from({ length }, (_, i) => (start + i * step).toFixed(2));
    }
    useEffect(() => {
        var colores = ['rgba(255, 255, 132, 1)', 'rgba(255, 0, 0, 1)', 'rgba(55, 99, 255, 1)',
            'rgba(0, 255, 0, 1)', 'rgba(255, 255, 255, 1)', 'rgba(142, 41, 250, 1)', 'rgba(250, 107, 41, 1)',
            'rgba(41, 250, 244, 1)', 'rgba(250, 41, 228, 1)', 'rgba(158, 250, 41, 1)', 'rgba(175, 122, 197, 1)',
            'rgba(15, 156, 60, 1)', 'rgba(200, 60, 5, 1)', 'rgba(50, 50, 50, 1)', 'rgba(50, 49, 50, 1)']
        var label = []
        var data = []
        var primero = 0;
        for (var dato of lista) {
            if (tipoPredio == "SWC") {
                if (primero == 0) {
                    label = generateList(0,1,0.05).slice(1)
                }
                var listaElegida = Object.values(dato);
                data.push({
                    label: getFechaConvertFull(dato.fecha.substring(0, 10), 0),
                    data: listaElegida.slice(3),
                    backgroundColor: colores[primero],
                })
            }else if (tipoPredio == "CB-DISPLAY") {
                if (primero == 0) {
                    label = dato.outputs.index.bands.B0.histogram.bins.map((item) => `${(item.lowEdge).toFixed(1)} - ${(item.highEdge).toFixed(1)}`)
                }
                data.push({
                    label: getFechaConvertFull(dato.interval.to.substring(0, 10), 0),
                    data: dato.outputs.index.bands.B0.histogram.bins.map((item) => (parseInt(item.count) * (100 * 100) / 10000).toFixed(1)),
                    backgroundColor: colores[primero],
                })
            }
            primero += 1
            // }
        }
        setData(
            {
                labels: label,
                datasets: data
            }
        );
    }, [])
    return (
        <Bar ref={chartc}
            options={options} 
            data={data} 
            width={window.innerWidth} 
            height='320px'
            /*onClick={(event, chart) =>{
                console.log(event)
                if (chartc.current) {
                    const elements = chartc.current.getElementsAtEventForMode(
                        event,
                        'nearest',
                        { intersect: true },
                        true
                    );
                    handleClick(event, elements);
                }
                //handleClick(event, chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true))
            }}*/
        />
    )
}

export default HistogramaGlobal

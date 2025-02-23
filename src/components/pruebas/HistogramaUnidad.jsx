import React, { useEffect, useState } from 'react'
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

function HistogramaUnidad(props) {
    const { selectItem, tipoPredio,info } = props;
    function getUnidad(tipo) {
        if (tipo == true) {
            return ''
        } else {
            if (tipoPredio == 'ABOVEGROUND_CARBON_DENSITY' || tipoPredio == 'ACD-DISPLAY') {
                return 'Mg de carbono x Ha'
            } else {
                return '%'
            }
        }
        /*if (tipoPredio == 'CONOPY_HEIGH') {
            return ' Area (Has)'//' Area (Has) por cada tramo (%) de Altura de dosel'
        } else if (tipoPredio == 'CONOPY_COVER') {
            return ' Area (Has)'//' Area (Has) por cada tramo (%) de cobertura de dosel'
        } else if (tipoPredio == 'ABOVEGROUND_CARBON_DENSITY' || tipoPredio == 'ACD-DISPLAY') {
            return ' Area (Has)'//' Area (Has) por cada tramo (%) de densidad de carbono'
        } else if (tipoPredio == 'Agua Suelo') {
            return ' Area (Has)'//' Area (Has) por cada tramo (%) de humedad en el suelo'
        } else if (tipoPredio == '3_NDVI') {
            return ''//"Valor de Indice NDVI "
        } else if (tipoPredio == '4_NDWI') {
            return ' '//"valores de indice NDWI"
        } else if (tipoPredio == '9_EVI') {
            return ' '//"valores de indice EVI"
        }else{
            return ' '
        }*/
    }
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
    function hexToRgb(hexa) {
        let r = parseInt(hexa.substring(0, 2), 16);
        let g = parseInt(hexa.substring(2, 4), 16);
        let b = parseInt(hexa.substring(4, 6), 16);
        return [r, g, b]
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
                display: false
            },
            title: {
                display: true,
                text: `${getUnidad(true)}`,
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
                    text: `${getUnidad(false)}`,
                    fontColor: '#ffff',
                    color: '#ffff'
                },
                ticks: { color: 'rgba(220, 221, 225)' }
            }
        }
    }

    const [data, setData] = useState({
        labels: [],
        datasets: [
        ]
    })
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
        if (tipoPredio == 'SWC') {
            label = generateList(0.00,1.0,0.05).slice(1);
            var listaElegida = Object.values(selectItem);
            data = listaElegida.slice(3).map(item=>parseFloat(item).toFixed(2))
        } else if (tipoPredio == 'CONOPY_HEIGH') {
            label = selectItem.valores.map((item) => `${item.highEdge}`)
            data = selectItem.valores.map((item) => parseInt(item.count) * (30 * 30) / 10000)
        } else if (tipoPredio == 'CONOPY_COVER') {
            label = selectItem.valores.map((item) => `${item.highEdge}`)
            data = selectItem.valores.map((item) => parseInt(item.count) * (30 * 30) / 10000)
        } else if (tipoPredio == 'ABOVEGROUND_CARBON_DENSITY' || tipoPredio == 'ACD-DISPLAY') {
            label = selectItem.valores.map((item) => `${item.highEdge}`)
            data = selectItem.valores.map((item) => parseInt(item.count) * (30 * 30) / 10000)
        } else if (tipoPredio == 'CB-DISPLAY') {
            label = selectItem.valores.map((item) => `${item.highEdge}`)
            data = selectItem.valores.map((item) => parseInt(item.count) * (10 * 10) / 10000)
        } else {
            label = selectItem.valores.map((item) => `${item.highEdge.toFixed(2)}`)
            data = selectItem.valores.map((item) => parseInt(item.count) * (6.06) / 10000)
        }

        setData(
            {
                labels: label,
                datasets: [
                    {
                        label: 'Area [Has]',
                        data: data,//selectItem.valores.map((item) => parseInt(item.count)*(30*30)/10000),
                        backgroundColor: info.rangocolores.map(item=>'#'+item[1]).reverse(),
                        barPercentage: 1.0,
                        categoryPercentage: 1.0,
                        max: 1,
                    }
                ]
            }
        );
    }, [selectItem])
    return (
        <Bar options={options} data={data} height='170px'/>
    )
}

export default HistogramaUnidad

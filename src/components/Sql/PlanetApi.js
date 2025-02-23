import { serverUrl } from '../Utils/UtilsAplication';

async function getFechasImagen(info) {
    var resultado = await fetch(`${serverUrl}/predio/getFechas`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getStadisticPredio(info) {
    var resultado = await fetch(`${serverUrl}/predio/getEstadisticPredio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getStadisticGeometria(info) {
    var resultado = await fetch(`${serverUrl}/predio/getStadisticGeometria`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getHistogramaPredio(info){
    var resultado = await fetch(`${serverUrl}/predio/getHistogramaPredio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getHistogramaGlobalPredio(info){
    var resultado = await fetch(`${serverUrl}/predio/getHistogramaGlobalPredio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getFechasDisponibles(info){
    var resultado = await fetch(`${serverUrl}/predio/getFechaRiegos`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getResultTiempo(info) {
    var resultado = await fetch(`${serverUrl}/predio/getResultTiempoRiego`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}

async function getUtbClasificadoDay(info) {
    var resultado = await fetch(`${serverUrl}/predio/getUtbClasificadoDay`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}

async function getStadisticTemp(info){
    var resultado = await fetch(`${serverUrl}/predio/getStadisticTemp`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
export default { getFechasImagen, getStadisticPredio,getStadisticGeometria,
    getHistogramaPredio,getHistogramaGlobalPredio,getFechasDisponibles,
    getResultTiempo,getUtbClasificadoDay,getStadisticTemp}
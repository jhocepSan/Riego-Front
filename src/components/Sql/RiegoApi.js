import { serverUrl } from '../Utils/UtilsAplication';

async function searchFundo(info) {
    var resultado = await fetch(`${serverUrl}/predio/searchFundoRiego`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}

async function getDatoPanio(info) {
    var resultado = await fetch(`${serverUrl}/predio/getDatoPanio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}
async function getEstadisticaMensual(info) {
    var resultado = await fetch(`${serverUrl}/predio/getMensualEstadistica`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}

export default { searchFundo, getDatoPanio,getEstadisticaMensual }
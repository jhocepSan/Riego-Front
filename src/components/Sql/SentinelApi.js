import { serverUrl } from '../Utils/UtilsAplication';

async function getEstadisticasPredio(info){//{geometry,tipoPredio,fechaIni,fechaFin,id}
    var resultado = await fetch(`${serverUrl}/sentinelap/getInfoStadisticPredio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}

async function getInfoPredio(info){//{geometria,id,fechaI,fechaF}
    var resultado = await fetch(`${serverUrl}/sentinelap/getInfoPredio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(info)
    })
    return resultado.json()
}

export default {getEstadisticasPredio,getInfoPredio}
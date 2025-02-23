import { serverUrl } from '../Utils/UtilsAplication';

async function getPermisosModulo(){
    var resultado = await fetch(`${serverUrl}/usuario/getPermisos`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        }
    })
    return resultado.json()
}

async function  addEditPermisoModulo(params) {
    var resultado = await fetch(`${serverUrl}/usuario/addEditPermiso`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body:JSON.stringify(params)
    })
    return resultado.json()
}

export default {getPermisosModulo,addEditPermisoModulo}
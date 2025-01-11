const serverUrl ='http://192.168.1.13:4001';//'https://backcmpc.forestryai.cl';//'https://backmar.forestryai.cl';//'https://back.forestryai.cl';//
const validarInicioSesion=()=>{
    var datos = localStorage.getItem('initLogin');
    if(datos!=undefined){
        return JSON.parse(datos);
    }else{
        return null;
    }
}
const fixEncoding=(encodedText)=> {
    const bytes = new TextEncoder().encode(encodedText);
    return new TextDecoder("utf-8").decode(bytes);
}
function decodeISO(encodedText) {
    try {
        // Intenta forzar la decodificación usando URI decoding
        return decodeURIComponent(escape(encodedText));
    } catch (error) {
        console.error("Error al decodificar:", error);
        return encodedText;
    }
}
export {serverUrl,validarInicioSesion,fixEncoding,decodeISO}
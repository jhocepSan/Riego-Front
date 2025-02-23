var meses = ["Enero", "Febr", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Sept", "Oct", "Nov", "Dic"];
function getDateFormat(data){
    //var fecha = new Date(data);
    if(data!=undefined){
        var fechaliteral=data.slice(0,10).split('-');
        var fecha = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2])
        return fecha.toLocaleDateString('en-GB');
    }else{
        return '?'
    }
}
function getYearFormat(data){
    var fecha = new Date(data);
    return fecha.getFullYear();
}
function getDayFormat(data){
    var fecha = new Date(data);
    return fecha.getDate();
}
function getMesAnio(data){
    var fecha = new Date(data);
    return meses[fecha.getMonth()]+'/'+fecha.getFullYear().toString().substring(2,4)
}
function getFechaLiteral(data){
    console.log(data)
    var fechaliteral = data.slice(0,10).split('-')
    var fecha = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2]);
    console.log(fecha)
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return fechaFormateada
}
function getDiasFecha(fechas){
    var fecha1 = new Date(fechas[0]);
    var fecha2 = new Date(fechas[1]);
    var diferencia = (fecha2.getTime()-fecha1.getTime())/(1000*60*60*24)
    return diferencia.toFixed(0)
}

function getFechaConvertIso(fecha,dias){ //dd-mm-yyyy
    if(fecha!=undefined){
        var fecha1 = new Date(fecha);
        fecha1.setDate(fecha1.getDate()+dias);
        return fecha1.toISOString()
    }else{
        return '-'
    }
}

function getFechaConvert(fecha,dias){ //dd-mm-yyyy
    if(fecha!=undefined){
        var fecha1 = new Date(fecha);
        fecha1.setDate(fecha1.getDate()+dias);
        return fecha1.toISOString().slice(0, 10);
    }else{
        return '-'
    }
}
function getFechaMinimo(fecha){//SIEMPRE FORMATO YYYY-MM-DD
    var fechaliteral=fecha.slice(0,10).split('-');
    var fecha1 = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2])
    fecha1.setHours(0,0,0)
    var dia = fecha1.getDate();
    dia = dia<10?`0${dia}`:dia;
    var mes = fecha1.getMonth()+1;
    mes = mes<10?`0${mes}`:mes;
    return dia+'/'+mes
}
function getFechaConvertMin(fecha,dias){ //dd-mm-yyyy
    var fechaliteral=fecha.slice(0,10).split('-');
    var fecha1 = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2])
    //var fecha1 = new Date(fecha);
    fecha1.setDate(fecha1.getDate()+dias);
    var dia = fecha1.getDate();
    dia = dia<10?`0${dia}`:dia;
    var mes = fecha1.getMonth()+1;
    mes = mes<10?`0${mes}`:mes;
    return dia+'/'+mes
}
function getFechaConvertFull(fecha,dias){ //dd-mm-yyyy
    //var fecha1 = new Date(fecha);
    var fechaliteral=fecha.slice(0,10).split('-');
    var fecha1 = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2])
    fecha1.setDate(fecha1.getDate()+dias);
    var dia = fecha1.getDate();
    dia = dia<10?`0${dia}`:dia;
    var mes = fecha1.getMonth()+1;
    mes = mes<10?`0${mes}`:mes;
    
    return dia+'/'+mes+'/'+fecha1.getFullYear().toString()
}
function getFechaNumerica(fecha,dias){ //ddmmyyyy
    //var fecha1 = new Date(fecha);
    var fechaliteral=fecha.slice(0,10).split('-');
    var fecha1 = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2])
    fecha1.setDate(fecha1.getDate()+dias);
    var dia = fecha1.getDate();
    dia = dia<10?`0${dia}`:dia;
    var mes = fecha1.getMonth()+1;
    mes = mes<10?`0${mes}`:mes;
    
    return dia+''+mes+''+fecha1.getFullYear().toString()
}
function getFechaSimpli(fecha){
    var fechaliteral=fecha.slice(0,10).split('-');
    var fecha1 = new Date(fechaliteral[0],fechaliteral[1]-1,fechaliteral[2])
    fecha1.setDate(fecha1.getDate());
    var dia = fecha1.getDate();
    dia = dia<10?`0${dia}`:dia;
    var mes = fecha1.getMonth()+1;
    mes = mes<10?`0${mes}`:mes;
    return dia+'-'+mes+'-'+fecha1.getFullYear().toString().slice(-2)
}
function getFechaDMA(fecha,dias){ //dd-mm-yyyy
    //var fecha1 = new Date(fecha);
    //var fechaliteral=fecha.slice(0,10).split('-');
    var fecha1 = new Date(fecha)
    fecha1.setDate(fecha1.getDate()+dias);
    var dia = fecha1.getDate();
    dia = dia<10?`0${dia}`:dia;
    var mes = fecha1.getMonth()+1;
    mes = mes<10?`0${mes}`:mes;
    
    return dia+'/'+mes+'/'+fecha1.getFullYear().toString()
}
function getFecha(fecha,dias){
    var fecha1 = new Date(fecha);
    fecha1.setDate(fecha1.getDate()+dias);
    return fecha1
}
function getFechaActual(dias){
    var fecha = new Date();
    fecha.setDate(fecha.getDate()+dias);
    return fecha.toISOString().slice(0, 10);
}

export {getDateFormat,getDiasFecha,getFechaConvert,getFecha,getDayFormat,
    getFechaConvertMin,getFechaConvertFull,getYearFormat,getMesAnio,
    getFechaMinimo,getFechaConvertIso,getFechaActual,getFechaLiteral,
    getFechaDMA,getFechaNumerica,getFechaSimpli}
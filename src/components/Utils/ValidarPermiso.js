
const verificarPermiso=(valor)=>{
    if (valor=='A'){
        return true
    }else{
        return false
    }
}
const permisoModulo=(valor)=>{
    var permisos = localStorage.getItem('info');
    if(permisos!==undefined && permisos !==null){
        permisos= JSON.parse(permisos).permisos;
        if (permisos.indexOf(1)>=0){
            return true
        }else{
            if(permisos.indexOf(valor)>=0){
                return true;
            }else{
                return false;
            }
        }
    }else{
        return false
    }
}

export {verificarPermiso,permisoModulo}
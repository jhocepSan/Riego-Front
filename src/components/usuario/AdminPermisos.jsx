import React, { useEffect, useState } from 'react'
import MsgUtils from '../Utils/MsgUtils'
import UsuarioApi from '../Sql/UsuarioApi';

function AdminPermisos() {
    const [permisos, setPermisos] = useState([]);
    const [nombrePermiso, setNombrePermiso] = useState('');
    const [actualizar, setActualizar] = useState(false);
    const [tipo, setTipo] = useState('N');
    const [selectPermiso,setSelectPermiso] = useState(null);
    const [isEdit,setIsEdit] = useState(false);
    const getPermisos = async () => {
        try {
            var result = await UsuarioApi.getPermisosModulo();
            console.log(result)
            if (result.ok) {
                console.log(result.ok);
                setPermisos(result.ok);
            } else {
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    const agregarPermiso = async () => {
        if (nombrePermiso != '') {
            try {
                if(tipo=='N'){
                    var result = await UsuarioApi.addEditPermisoModulo({ 'idmodulo': 1, 'descripcion': nombrePermiso, tipo });
                    if (result.ok) {
                        setNombrePermiso('');
                        MsgUtils.msgCorrecto(result.ok);
                        setActualizar(!actualizar);
                    } else {
                        MsgUtils.msgError(result.error);
                    }
                }else{
                    await accionPermiso('M',selectPermiso);
                }
            } catch (error) {
                MsgUtils.msgError(error.message);
            }
        } else {
            MsgUtils.msgAdvertencia("No se permite agregar un permiso vacio")
        }
    }
    const accionPermiso = async(tipo,valor)=>{
        var permiso = valor;
        if(tipo=='E'){
            permiso.estado ='E';
        }else{
            permiso.descripcion = nombrePermiso;
            permiso.estado ='A';
        }
        try {
            var result = await UsuarioApi.addEditPermisoModulo({...permiso,'tipo':'S'});
            if(result.ok) {
                setTipo('N')
                setIsEdit(false);
                setSelectPermiso(null);
                setNombrePermiso('');
                MsgUtils.msgCorrecto(result.ok);
                setActualizar(!actualizar);
            }else{
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    useEffect(() => {
        getPermisos();
    }, [actualizar])
    return (
        <div className='container-fluid py-1' style={{ minHeight: '220px' }}>
            <div className='row row-cols g-1'>
                <div className='col' style={{}}>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-transparent text-light fw-bold " style={{ border: 'none' }}>Nombre Permiso</span>
                        <input type="text" className="form-control" placeholder="...?"
                            value={nombrePermiso}
                            onChange={(e) => {
                                if (e.target.value.length < 20) {
                                    setNombrePermiso(e.target.value.toUpperCase());
                                } else {
                                    MsgUtils.msgAdvertencia("Solo se permite 20 Caracteres");
                                }
                            }} />
                        <button className='btn btn-sm btn-success' title='agregar permiso'
                            onClick={() => agregarPermiso()}>
                            <i className="fa-solid fa-circle-plus"></i>
                        </button>
                    </div>
                    {isEdit==true&&
                    <div className='w-100 py-2'>
                        <button className='btn btn-sm btn-danger'
                        title='Salir de la Edicion del permiso'
                        onClick={()=>{
                            setIsEdit(false);setSelectPermiso(null);setNombrePermiso('');setTipo('N');}}>
                            <i className="fa-solid fa-xmark fa-xl"></i> Salir de la Edición
                        </button>
                    </div>}
                </div>
                {isEdit==false&&<div className='col' style={{ minWidth: '220px', maxWidth: '250px' }}>
                    <div className='overflow-auto' style={{ maxHeight: '300px' }}>
                        <ul className="list-group list-group-sm ">
                            {permisos.map((item, index) => {
                                return (
                                    <li className="list-group-item bg-dark bg-gradient text-light m-0 p-0" key={index}>
                                        <div className='container-fluid'>
                                            <div className='row row-cols-2 gx-1'>
                                                <div className='col col-8 my-auto'>
                                                    {item.descripcion}
                                                </div>
                                                <div className='col col-4'>
                                                    <div className='btn-group btn-group-sm'>
                                                        <button className='btn btn-sm btn-secondary bg-gradient'
                                                            title={`Editar Permiso ${item.descripcion}`}
                                                            onClick={()=>{
                                                                setNombrePermiso(item.descripcion);
                                                                setSelectPermiso(item);
                                                                setIsEdit(true);
                                                                setTipo('E');
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square fa-xl"></i>
                                                        </button>
                                                        <button className='btn btn-sm btn-danger bg-gradient'
                                                            title={`Eliminar Permiso ${item.descripcion}`}
                                                            onClick={()=>accionPermiso('E',item)}
                                                        >
                                                            <i className="fa-solid fa-trash-can fa-xl"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default AdminPermisos

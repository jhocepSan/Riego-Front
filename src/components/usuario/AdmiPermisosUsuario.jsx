import React, { useEffect, useState } from 'react'
import MsgUtils from '../Utils/MsgUtils';
import UsuarioApi from '../Sql/UsuarioApi';

function AdmiPermisosUsuario(props) {
    const { usuario } = props;
    const [permisoModulos, setPermisoModulo] = useState([]);
    const [permisoUsuario, setPermisoUsuario] = useState([]);
    const [addPermiso,setAddPermiso] = useState(-1)
    const getPermisosModulo = async () => {
        try {
            var result = await UsuarioApi.getPermisosModulo();
            if (result.ok) {
                setPermisoModulo(result.ok);
            } else {
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    useEffect(() => {
        getPermisosModulo()
        getPermisosUsuario()
    }, [])
    return (
        <div className='container-fluid'>
            <div className='row row-cols g-1'>
                <div className='col'>
                    <div className='overflow-auto' style={{ height: "290px" }}>
                        <ul className="list-group list-group-flush" id='listaPermisos'>
                            {permisoModulos.map((item, index) => {
                                if (permisoUsuario.indexOf(item) < 0) {
                                    return (
                                        <li className={`list-group-item m-0 p-0 ${addPermiso === item.idpermiso ? 'itemSelectOk' : 'bg-secondary'} bg-gradient`} key={index}>
                                            <button className='w-100 btn btn-sm text-light fw-bold' onClick={() => agregarPermisoAdd(item)}>
                                                {item.descripcion}
                                            </button>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </div>
                </div>
                <div className='col' style={{ minWidth: '60px', maxWidth: '60px' }}>
                    <div className='container-fluid'>
                        <div className='text-center'>
                            <button className='btn btn-sm btn-transparent bg-gradient text-light'
                                title='Quitar permiso del Usuario'>
                                <i className="fa-solid fa-circle-left fa-2xl"></i>
                            </button>
                        </div>
                        <hr className='m-0 p-1'></hr>
                        <div className='text-center'>
                            <button className='btn btn-sm btn-transparent bg-gradient text-light'
                                title='Agregar permiso al Usuario'>
                                <i className="fa-solid fa-circle-right fa-2xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col'>

                </div>
            </div>
        </div>
    )
}

export default AdmiPermisosUsuario

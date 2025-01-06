import React, { useEffect, useState } from 'react'
import { serverUrl } from '../Utils/UtilsAplication.js';
import MsgUtils from '../Utils/MsgUtils';

function AddEditUsuario(props) {
    const { selectUser, setShowModal, actualizar, setActualizar, tipo } = props;
    const [empresas, setEmpresas] = useState([]);
    const [idUser, setIdUser] = useState(0);
    const [nameUser, setNameUser] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [passwordc, setPasswordc] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [idEmpresa, setIdEmpresa] = useState(0);
    const [tipoUsuario, setTipoUsuario] = useState('U');
    const [error, setError] = useState({});
    function validarDatos() {
        if (password != passwordc && isEdit == false) {
            setError({ "errPass": "No Coinciden las Contraseñas" });
            return false;
        }
        if (apellidos == '' || nombres == '' || telefono == '' || ((password == '' || passwordc == '') && !isEdit) || correo == '') {
            setError({ "errVacio": "Este Campo Es requerido" });
            return false;
        }
        if (correo.indexOf('@') == -1) {
            setError({ "errEmail": "Correo inngresado invalido" });
            return false;
        }
        return true
    }
    function getEmpresas() {
        fetch(`${serverUrl}/usuario/getEmpresas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                    setEmpresas(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(err => MsgUtils.msgError(err));
    }
    function guardarUsuario() {
        if (validarDatos()) {
            var url = '';
            if (isEdit) {
                url = `${serverUrl}/usuario/editUser`
            } else {
                url = `${serverUrl}/usuario/addUser`
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isEdit, idUser, nameUser, nombres, apellidos, telefono, correo, password, idEmpresa, tipoUsuario })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        setActualizar(!actualizar);
                        setShowModal(false);
                        MsgUtils.msgCorrecto(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(err => MsgUtils.msgError(err));
        } else {
            MsgUtils.msgError("Verificar Información")
        }
    }
    function cambiarContrasenia() {
        if (password != '' && passwordc != '') {
            if (password == passwordc) {
                fetch(`${serverUrl}/usuario/changePassword`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idUser, password })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            setActualizar(!actualizar);
                            setShowModal(false);
                            MsgUtils.msgCorrecto(data.ok);
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(err => MsgUtils.msgError(err));
            } else {
                setError({ "errPass": "No Coinciden las Contraseñas" });
            }
        } else {
            setError({ "errVacio": "Este Campo Es requerido" });
        }
    }
    useEffect(() => {
        if (selectUser !== null) {
            console.log(selectUser)
            setIdUser(selectUser.idusuario)
            setNameUser(selectUser.username)
            setNombres(selectUser.nombres);
            setApellidos(selectUser.apellidos);
            setTelefono(selectUser.telefono);
            setCorreo(selectUser.correo);
            setIdEmpresa(selectUser.id_empresa);
            setTipoUsuario(selectUser.tipo_usuario);
            setIsEdit(true);
        }
        getEmpresas();
    }, [])
    return (
        <div className="card m-0 p-0 bg-transparent">
            <div className="card-body">
                <div className="mb-2">
                    <label className="form-label text-light">Nombres</label>
                    <input className="form-control" placeholder="Nombres"
                        disabled={tipo == 'P' ? true : false}
                        value={nombres} onChange={(e) => setNombres(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="form-label text-light">Apellidos</label>
                    <input className="form-control" placeholder="Apellidos"
                        disabled={tipo == 'P' ? true : false}
                        value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="form-label text-light">Telefono</label>
                    <input className="form-control" placeholder="9012"
                        disabled={tipo == 'P' ? true : false}
                        value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="form-label text-light">Correo</label>
                    <input className="form-control" placeholder="name@example.com"
                        disabled={tipo == 'P' ? true : false}
                        value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label className='form-label text-light'>Empresa</label>
                    <select className="form-select form-select-sm"
                        disabled={tipo == 'P' ? true : false}
                        value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)}>
                        <option value={0}>Ninguno</option>
                        {empresas.map((item, index) => {
                            return (
                                <option value={item.id_empresa}>{item.nombre}</option>
                            )
                        })}
                    </select>
                </div>
                {isEdit && <div className='mb-2'>
                    <label className='form-label text-light'>Tipo Usuario</label>
                    <select className="form-select form-select-sm"
                        disabled={tipo == 'P' ? true : false}
                        value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                        <option value={'U'}>Usuario</option>
                        <option value={'A'}>Administrador</option>
                    </select>
                </div>}
                {!isEdit &&
                    <div className="mb-2">
                        <label className="form-label text-light">Contraseña</label>
                        <input type="password" className="form-control" placeholder="contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>}
                {!isEdit &&
                    <div className="mb-2">
                        <label className="form-label text-light">Confirmar Contraseña</label>
                        <input type="password" className="form-control" placeholder="contraseña" value={passwordc} onChange={(e) => setPasswordc(e.target.value)} />
                    </div>}
                {tipo == 'P' &&
                    <div className="mb-2">
                        <label className="form-label text-light">Contraseña</label>
                        <input type="password" className="form-control" placeholder="contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                }
                {tipo == 'P' &&
                    <div className="mb-2">
                        <label className="form-label text-light">Confirmar Contraseña</label>
                        <input type="password" className="form-control" placeholder="contraseña" value={passwordc} onChange={(e) => setPasswordc(e.target.value)} />
                    </div>}
            </div>
            <div className='card-footer text-center'>
                {!isEdit && <button className='btn btn-sm btn-success' onClick={() => guardarUsuario()}>
                    <i className="fa-solid fa-user-plus"></i> Crear Cuenta</button>}
                {isEdit && tipo!=='P'&& <button className='btn btn-sm botonOscuro' onClick={() => guardarUsuario()}>
                    <i className="fa-solid fa-user-pen"></i> Editar Usuario
                </button>}
                {tipo == 'P' && <button className='btn btn-sm botonOscuro' onClick={() => cambiarContrasenia()}>
                    <i className="fa-solid fa-user-pen"></i> Cambiar Contraseña
                </button>}
            </div>
        </div>
    )
}

export default AddEditUsuario

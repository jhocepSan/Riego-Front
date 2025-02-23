import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { serverUrl } from '../Utils/UtilsAplication.js';
import MsgUtils from '../Utils/MsgUtils';
import AddEditUsuario from './AddEditUsuario';
import { ContextAplications } from '../../App';
import AdminPermisos from './AdminPermisos.jsx';
import {verificarPermiso} from '../Utils/ValidarPermiso.js';
import AdmiPermisosUsuario from './AdmiPermisosUsuario.jsx';

function AdministrarUsuario() {
    const { isLogin, setIsLogin, setLoading, datosUser, setDatosUser } = useContext(ContextAplications);
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectUser, setSelectUser] = useState(null);
    const [tituloModal, setTituloModal] = useState('');
    const [tipoModal, setTipoModal] = useState('');
    const [actualizar, setActualizar] = useState(false);
    function getusuarios() {
        setLoading(true);
        fetch(`${serverUrl}/usuario/getusers`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setUsuarios(data.ok);
                    console.log(data.ok);
                } else {
                    MsgUtils.msgError(data.error)
                }
                setLoading(false);
            })
            .catch(err => MsgUtils.msgError(err));
    }
    function cambiarEstado() {
        fetch(`${serverUrl}/usuario/setEstadoUser/${selectUser.idusuario}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setShowModal(false);
                    setActualizar(!actualizar);
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error)
                }
            })
            .catch(err => MsgUtils.msgError(err));
    }
    function cambiarEstadoLeyenda(dato,i) {
        var valor = i==true?1:0;
        fetch(`${serverUrl}/usuario/setLegendaHD/${dato.idusuario}/${valor}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setActualizar(!actualizar);
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error)
                }
            })
            .catch(err => MsgUtils.msgError(err));
    }
    useEffect(() => {
        getusuarios()
    }, [actualizar])
    return (
        <div className='fondoInicial vh-100' style={{ paddingTop: '60px' }} >
            <div className='container-fluid'>
                <div className='row row-cols g-1 py-1'>
                    <div className='col' style={{ maxWidth: '140px', minWidth: '140px' }}>
                        <button className='btn btn-success btn-sm'
                            onClick={() => { setSelectUser(null); setTituloModal('Agregar Nuevo Usuario'); setTipoModal('E'); setShowModal(true) }}>
                            <i className="fa-solid fa-user-plus"></i> Nuevo Usuario
                        </button>
                    </div>
                    {verificarPermiso('2')&&<div className='col' style={{ maxWidth: '170px', minWidth: '170px' }}>
                        <button className='btn btn-secondary btn-sm w-100'
                            onClick={()=>{setTituloModal("Administrar Permisos Modulo");setTipoModal('A');setShowModal(true);}}>
                            <i className="fa-solid fa-lock"></i> Admin Permisos</button>
                    </div>}
                    <div className='col' style={{ maxWidth: '100px', minWidth: '100px' }}>
                        <button className='btn btn-light btn-sm' 
                            onClick={() => setActualizar(!actualizar)}><i className="fa-solid fa-rotate-right"></i> Cargar</button>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className="table table-dark tabla-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Usuario</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Empresa</th>
                            <th scope="col">Celular</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className='container-fluid'>
                                            <div>{item.nombres + ' ' + item.apellidos}</div>
                                            <div><span className={`badge ${item.tipo_usuario == 'U' ? 'bg-dark text-light bg-gradient' : 'bg-light text-dark'}`}>{item.tipo_user}</span></div>
                                        </div>
                                    </td>
                                    <td>{item.correo}</td>
                                    <td>{item.nombre_empresa}</td>
                                    <td>{item.telefono}</td>
                                    <td>
                                        <div className='btn-group '>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                label="L-HD"
                                                checked={item.leyenda_imghd==1?true:false}
                                                onChange={(e)=>cambiarEstadoLeyenda(item,e.target.value)}
                                            />
                                            <button className='btn btn-sm mx-1 text-light'
                                                title={`Agregar permiso al Usuario ${item.nombres}`}
                                                onClick={()=>{
                                                    setTipoModal('U');setTituloModal('Permisos para '+item.nombres);
                                                    setSelectUser(item);setShowModal(true);
                                                }}
                                                ><i className="fa-solid fa-user-shield"></i></button>
                                            <button className='btn btn-sm mx-1 text-light'
                                                title={`Editar el usuario - ${item.nombres}`} 
                                                onClick={() => { setTipoModal('E'); setTituloModal('Editar Usuario'); setSelectUser(item); setShowModal(true) }}>
                                                <i className="fa-solid fa-user-pen"></i>
                                            </button>
                                            <button className='btn btn-sm mx-1 text-light' 
                                                title={`Cambiar la contraseña de ${item.nombres}`}
                                                onClick={()=>{setTipoModal('P');setTituloModal("Cambiar Contraseña");setSelectUser(item);setShowModal(true);}}>
                                                <i className="fa-solid fa-user-secret"></i>
                                            </button>
                                            <button className='btn btn-sm mx-1 text-light' 
                                                title={`Eliminar al usuario '${item.nombres}' del sistema`}
                                                onClick={() => { setTipoModal('R'); setTituloModal('Eliminar Usuario'); setSelectUser(item); setShowModal(true) }}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size={['E','P','R'].includes(tipoModal)?'md':'lg'}
                backdrop="static"
                keyboard={false}
                contentClassName='fondoOscuro'
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title bsPrefix='text-light'>{tituloModal}</Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-body m-0 p-0'>
                    {(tipoModal === 'E'||tipoModal === 'P') && <AddEditUsuario selectUser={selectUser} setShowModal={setShowModal} actualizar={actualizar} setActualizar={setActualizar} tipo={tipoModal} />}
                    {tipoModal === 'R' &&
                        <div className='container-fluid py-2'>
                            <p className='text-light text-center fw-bold fs-5 w-100'>
                                {`Seguro de eliminar al usuario (${selectUser.correo}) ...?`}
                            </p>
                        </div>}
                    {tipoModal === 'A' &&
                        <AdminPermisos/>
                    }
                    {tipoModal ==='U' &&
                        <AdmiPermisosUsuario usuario={selectUser}/>}
                </Modal.Body>
                {tipoModal === 'R' &&
                    <Modal.Footer>
                        <button className='btn btn-sm btn-danger' onClick={() => setShowModal(false)}>Cancelar</button>
                        <button className='btn btn-sm btn-success mx-2' onClick={() => cambiarEstado()}>Aceptar</button>
                    </Modal.Footer>
                }
            </Modal>
        </div>
    )
}

export default AdministrarUsuario

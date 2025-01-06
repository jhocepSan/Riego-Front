import React, { useContext, useEffect } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { ContextAplications } from '../../App';
import { useNavigate } from 'react-router-dom';
import { verificarPermiso } from './ValidarPermiso';
function MenuOpciones() {
    const { showMenu, setShowMenu, setTitulo, menuActivo, setMenuActivo, isLogin, setIsLogin, setDatosUser, datosUser, tipoPagina, setTipoPagina } = useContext(ContextAplications);
    const navigate = useNavigate();
    function cambiarVentana(activo, titulo, ruta) {
        setTitulo(titulo);
        navigate('/' + ruta, { replace: true })
        setShowMenu(false);
        setMenuActivo(activo)
    }
    function cerrarSesion() {
        localStorage.clear();
        setTitulo('');
        setDatosUser({});
        setIsLogin(false);
        navigate('', { replace: true })
        setShowMenu(false);
    }
    useEffect(() => {
        if (isLogin == false) {
            var time = localStorage.getItem('tiempo');
            if (time != undefined || time != null) {
                var timeFinal = new Date().getTime() - time
                if ((timeFinal / (1000 * 60 * 60 * 24)) <= 2) {
                    var datos = JSON.parse(localStorage.getItem('info'))
                    if (datos != undefined || datos != null) {
                        setIsLogin(true);
                        setDatosUser(datos);
                        setTipoPagina(datos.tipoPagina);
                    } else {
                        localStorage.clear();
                        cambiarVentana(0, '', '');
                    }
                } else {
                    localStorage.clear();
                    cambiarVentana(0,'','');
                }
            } else {
                localStorage.clear();
                cambiarVentana(0, '', '');
            }
        }
    }, [])
    return (
        <Offcanvas show={showMenu} onHide={setShowMenu} placement='end' backdrop={true} bsPrefix=' offcanvas offcanvas-start fondoOscuro'>
            <Offcanvas.Header closeButton closeVariant='white' bsPrefix='offcanvas-header bg-secondary bg-gradient'>
                <Offcanvas.Title bsPrefix='text-light fw-bold offcanvas-title fa-bounce'>
                    <a className='btn btn-sm btn-dark' onClick={() => cambiarVentana(0, '', '')}><i className="fa-solid fa-house"></i> INICIO </a>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start text-start">
                    {verificarPermiso(datosUser.tipoUsuario) && <li className={`bg-gradient border-none text-start w-100 m-0 p-0 ${menuActivo === 1 ? 'menuActivo' : ''}`}>
                        <a className={`btn btn-sm w-100 text-start ${menuActivo === 1 ? 'text-dark' : 'text-light'} fs-6 menuTk`}
                            onClick={() => cambiarVentana(1, "CONFIGURACIONES", "configuracion")}>
                            <i className="fa-solid fa-gear"></i> Configuración
                        </a>
                    </li>}
                    {verificarPermiso(datosUser.tipoUsuario) && <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo === 2 ? 'menuActivo' : ''}`}>
                        <button className={`btn btn-sm w-100 ${menuActivo === 2 ? 'text-dark' : 'text-light'} text-start fs-6 menuTk`}
                            onClick={() => cambiarVentana(2, "ADMINISTRAR USUARIOS", "admu")}>
                            <i className="fa-solid fa-people-group"></i> Administrar Usuarios
                        </button>
                    </li>}
                    {tipoPagina!='4003'&&<li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo === 3 ? 'menuActivo' : ''}`}>
                        <button className={`btn btn-sm w-100 ${menuActivo === 3 ? 'text-dark' : 'text-light'} text-start fs-6 menuTk`}
                            onClick={() => cambiarVentana(3, "Visualización de mapa", "mapa")}>
                            <i className="fa-regular fa-map " ></i> Ver mapa
                        </button>
                    </li>}
                </ul>
            </Offcanvas.Body>
            <div className='container-fluid text-center pb-2'>
                <button className='btn btn-sm btn-danger bg-gradient fw-bold tituloMenu' onClick={() => cerrarSesion()}>
                    <i className="fa-solid fa-right-from-bracket fa-xl fa-fade"></i> SALIR SISTEMA
                </button>
            </div>
        </Offcanvas>
    )
}

export default MenuOpciones
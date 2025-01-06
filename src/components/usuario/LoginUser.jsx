import React, { useContext, useEffect, useState } from 'react'
import { ContextAplications } from '../../App';
import MsgUtils from '../Utils/MsgUtils';
import { serverUrl } from '../Utils/UtilsAplication.js';

function LoginUser() {
    const { isLogin, setIsLogin, setLoading, datosUser, setDatosUser, tipoPagina, setTipoPagina } = useContext(ContextAplications);
    const [ventana, setVentana] = useState(0);
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    function validarCampos() {
        if (correo != '') {
            if (correo.indexOf('@') != -1) {
                if (password != '') {
                    return true;
                } else {
                    setError({ "errpass": "Introdusca Tu Contraseña" });
                    return false;
                }
            } else {
                setError({ 'errmail': "Correo invalido, verifique ..." });
                return false;
            }
        } else {
            setError({ 'errmail': "Introdusca su Correo" });
            return false;
        }
    }
    function comprobarCredenciales() {
        if (validarCampos()) {
            var country = 'ALL'
            var locAt = localStorage.getItem('location')
            if (locAt != undefined || locAt != null) {
                country = JSON.parse(locAt).country_name;
            }
            setLoading(true);
            fetch(`${serverUrl}/usuario/singin`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ 'address': correo, 'pass': password, 'tipoPagina': tipoPagina, 'country': country })
            })
                .then(res => res.json())
                .then(data => {
                    setLoading(false);
                    if (data.ok) {
                        if (data.ok.estado == 'A') {
                            var timeint = new Date()
                            setVentana(2);
                            localStorage.setItem('info', JSON.stringify({ ...data.ok, tipoPagina,permisos:data.ok.permisos.map(item=>item.idpermiso) }));
                            localStorage.setItem('tiempo', timeint.getTime());
                            setDatosUser({...data.ok,permisos:data.ok.permisos.map(item=>item.idpermiso)});
                            setIsLogin(true);
                        } else {
                            setIsLogin(false);
                            setError({ 'errlogin': "No Puedes Ingresar" });
                            MsgUtils.msgError("No Puedes Ingresar");
                        }
                    } else {
                        setIsLogin(false);
                        console.log(data)
                        setError({ 'errlogin': data.error });
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => {
                    console.log(error);
                    MsgUtils.msgError(toString(error.message));
                })
        }
    }
    function getLocalizacion() {
        fetch(`https://ipapi.co/json/`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('location', JSON.stringify(data))
            })
            .catch(error => {
                console.log(error);
            })
    }
    useEffect(() => {
        var dato = window.location.hostname.split('.');
        if(dato[0]=='inra'){
            setTipoPagina('4000')
        }else if(dato[0]=='marvich'){
            setTipoPagina('4002');
        }else if(dato[0]=='agricultura'){
            setTipoPagina('4003')
        }else{
            setTipoPagina('3000');
        }
        getLocalizacion()
    }, [])
    return (
        <div className='container-fluid fondoCuerpo ' style={{ height: '100vh' }}>
            {ventana == 0 &&
                <div className='card fondoOscuro'>
                    {error && error.errlogin != undefined && <div className="alert alert-danger" role="alert">
                        {error.errlogin}
                    </div>}
                    <div className='card-header text-center text-light fw-bold fs-4'>
                        <i className="fa-solid fa-user"></i> Iniciar Sesión
                    </div>
                    <div className='card-body'>
                        <div className="mb-2">
                            <label className="form-label text-light">Correo</label>
                            <input type="text" placeholder="correo@gmail.com" className="form-control" value={correo} onChange={(e) => { setError({}); setCorreo(e.target.value); }}></input>
                            {error && error.errmail != undefined && <span className="badge bg-danger">{error.errmail}</span>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label text-light">Contraseña</label>
                            <div className='row row-cols-2 gx-0'>
                                <div className='col col-11'>
                                    <input type={showPassword == true ? "text" : "password"} className="form-control" placeholder="contraseña" value={password}
                                        onChange={(e) => { setError({}); setPassword(e.target.value); }} />
                                </div>
                                <div className='col col-1'>
                                    <button className='btn btn-sm px-0' onClick={() => setShowPassword(!showPassword)}>
                                        <img src={showPassword == true ? '/nopassword.png' : '/password.png'} width={25}></img>
                                    </button>
                                </div>
                            </div>
                            {error && error.errpass != undefined && <span className="badge bg-danger">{error.errpass}</span>}
                        </div>
                        <div>
                            <a className=" text-secondary" style={{ cursor: 'pointer' }} onClick={() => console.log('hooa')}>¿ Olvidaste tu contraseña ?</a>
                        </div>
                    </div>
                    <div className='card-footer'>
                        <button className='btn btn-sm botonOscuro w-100' onClick={() => comprobarCredenciales()}>
                            <i className="fa-solid fa-arrow-right-to-bracket fa-2xl"></i>&nbsp;Iniciar</button>
                    </div>
                </div>}
        </div>
    )
}

export default LoginUser

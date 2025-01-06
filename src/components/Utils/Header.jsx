import React, { useContext } from 'react'
import { ContextAplications } from '../../App'


function Header() {
    const { titulo, isLogin,setShowMenu,datosUser,tipoPagina} = useContext(ContextAplications);
    const mostrarUserLogin = () => {
        var datos = JSON.parse(localStorage.getItem('info'));
        if (isLogin) {
            /*var imagen = Buffer.from(ReactSession.get("foto").data);
            imagen = imagen.toString('base64');
            var src = 'data:image/jpg;base64,' + imagen;*/
            return (
                <div className="navbar-brand card flex-row fondoOscuro m-0 p-0 " >
                    <a className='btn btn-sm btn-transparent fs-4 my-auto text-light btnMenu'
                        onClick={() => setShowMenu(true)}>
                        <i className="fa-solid fa-bars"></i>
                    </a>
                    <div className='ps-2 my-auto d-none d-sm-inline'>
                        <div className="nombreHeader lh-1">{datosUser.nombres}<br className='m-0 p-0'></br><span className='cargoHeader '>{datosUser.apellidos}</span></div>
                    </div>
                    <div className="dropdown dropend">
                        <a className="btn btn-sm dropdown-toggle" role="button" id="MenuOptiones" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src='/cmpc.jpeg' width="100" height="42" className=" my-auto card-img-left  imgUser" />
                        </a>
                        <ul className="dropdown-menu bg-light bg-gradient" aria-labelledby="MenuOptiones">
                            <li><a className="dropdown-item btn btn-sm fw-bold" onClick={() => cambiarVentana('7', 'Cambiar Credenciales')}>Cambiar Usuario/Contraseña</a></li>
                            <li><a className="dropdown-item btn btn-sm fw-bold" onClick={() => cambiarVentana('8', 'Ver Perfil')}>Ver Perfil</a></li>
                        </ul>                        
                    </div>
                    {tipoPagina=='I'&&<img src='/cadenaDoble.png'></img>}
                </div>);
        }
    }
    return (
        <div className="navbar navbar-dark fondoOscuro m-0 p-0 menuFlotante w-100" >
            <div className="container-fluid ">
                {mostrarUserLogin()}
                {titulo !== '' &&
                    <div className='text-light fw-bold fs-6 text-uppercase'>{titulo}</div>}
                <div className="navbar-brand card flex-row fondoOscuro m-0 p-0" >
                    <img src='/marchiv2.png' width="150" className="d-inline-block align-text-top card-img-left my-auto py-2" />
                    {tipoPagina=='3000'&&false&&<img src='/devimg.png' width="30" className="d-inline-block align-text-top card-img-left my-auto py-2" />}
                    {tipoPagina=='3000'&&false&&<div className='ps-2 my-auto d-none d-sm-inline'>
                        <div className="cargoHeader lh-sm">Modo<br></br>Dev</div>
                    </div>}
                    {tipoPagina=='4002'&&<img src='/marchiv2.png' width="150" className="d-inline-block align-text-top card-img-left my-auto py-2" />}
                    {tipoPagina=='4003'&&<img src='/marchiv2.png' width="150" className="d-inline-block align-text-top card-img-left my-auto py-2" />}
                    {tipoPagina=='4000'&&<img src='/bolivia200.png' width="50" className="d-inline-block align-text-top card-img-left my-auto mx-2" />}
                    {tipoPagina=='4000'&&<img src='/inralogo.png' width="90" className="d-inline-block align-text-top card-img-left my-auto" />}
                </div>
            </div>
        </div>
    )
}

export default Header
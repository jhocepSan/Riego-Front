import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ContextAplications } from '../../App';
import LoginUser from './LoginUser';
import {verificarPermiso} from '../Utils/ValidarPermiso';

function Inicio() {
  const navigate=useNavigate();
  const { isLogin, setIsLogin, setLoading, datosUser, tipoPagina,setTitulo,menuActivo,setMenuActivo } = useContext(ContextAplications);
  const [ventana,setVentana] = useState(0);
  function cambiarVentana(activo,titulo,ruta){
    setTitulo(titulo);
    navigate('/'+ruta,{replace:true})
    setMenuActivo(activo)
}
  useEffect(()=>{
    if(isLogin){
      setVentana(1);
    }else{
      setVentana(0);
    }
  },[isLogin])
  return (
    <>{ventana==0&& <LoginUser></LoginUser>}
      {ventana==1&& 
        <div className='container-fluid fondoInicial vh-100'>
          <div className='row row-cols gx-4 my-auto'>
            {tipoPagina!='4003'&&
            <div className='col' style={{minWidth:'150px',maxWidth:'150px'}}>
              <button className='btn btn-transparent btn-sm btnMenu' 
                style={{width:'100px'}}
                onClick={()=>cambiarVentana(3,'Ver Mapa','mapa')}>
                <div className='bg-light rounded-circle ' style={{height:'80px'}}>
                  <img  className='py-2' src='mapa.png' width={50}></img>
                </div>
                <span className='text-light'>Mapa</span>
              </button>
            </div>}
          </div>
        </div>
      }
    </>
  )
}

export default Inicio
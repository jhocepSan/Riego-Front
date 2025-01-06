import { createContext, useState } from 'react'
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import ModalLoader from './components/Utils/ModalLoader';
import Inicio from './components/usuario/Inicio';
import Header from './components/Utils/Header';
import MenuOpciones from './components/Utils/MenuOpciones';
import AdministrarUsuario from './components/usuario/AdministrarUsuario';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import MapContainer from './components/pruebas/MapContainer';

export const ContextAplications = createContext();

function App() {
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuActivo, setMenuActivo] = useState(0);
  const [datosUser, setDatosUser] = useState({});
  const [tipoPagina,setTipoPagina] = useState('');
  return (
    <ContextAplications.Provider value={{
      loading, setLoading, titulo, setTitulo, isLogin, setIsLogin, showMenu, 
      setShowMenu, menuActivo, setMenuActivo, datosUser, setDatosUser,
      tipoPagina,setTipoPagina
    }}>
      <Header />
      <HashRouter basename='/'>
        <MenuOpciones />
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/mapa' element={<MapContainer/>} />
          <Route path='/admu' element={<AdministrarUsuario />} />
        </Routes>
      </HashRouter>
      <ModalLoader show={loading} />
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ContextAplications.Provider>
  )
}

export default App

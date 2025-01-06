import React, { useContext, useEffect, useRef, useState } from 'react'
import { ContextAplications } from '../../App';
import { serverUrl } from '../Utils/UtilsAplication.js';

function TablaView() {
    const { loading, setLoading } = useContext(ContextAplications);
    const cmpTabla = useRef();
    const [listaDatos, setListaDatos] = useState([]);
    const [tablaCmp, setTablaCmp] = useState(null);
    const [loadCmp, setLoadCmp] = useState(false);
    const tablaRef = useRef();
    tablaRef.current = tablaCmp;
    const getDatosTabla = () => {
        if (listaDatos.length == 0) {
            setLoading(true);
            fetch(`${serverUrl}/usuario/listaPredios`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                }
            })
                .then((res) => res.json())
                .then(data => {
                    console.log(data)
                    setLoading(false);
                    if (data.ok) {
                        setListaDatos(data.ok);
                        tablaRef.current.getStore().setData(data.ok)
                    } else {
                        console.log(data.error);
                    }
                })
        }
    }
    function handleResize() {
        //console.log(window.innerWidth)
        tablaRef.current.setWidth(window.innerWidth)
    }
    const initComponentes = () => {
        if (tablaCmp == null) {
            console.log("initComponente")
            //setLoadCmp(true);
            var btn = Ext.create('Ext.grid.Panel', {
                title: 'Lista de Resultados',
                resizable: true,
                store: Ext.create('Ext.data.Store', {
                    storeId: 'simpsonsStore',
                    fields: ['id_predio', 'nombre', 'acciones'],
                    data: [
                    ]
                }),
                columns: [
                    { text: 'Id', dataIndex: 'id_predio' },
                    { text: 'Nombre', dataIndex: 'nombre', flex: 1 },
                    { text: 'Acciones', dataIndex: 'phone' }
                ],
                with: window.innerWidth,
                height: 200,
                renderTo: 'botonPrueba',
                viewConfig: {
                    listeners: {
                        onResize: function (width, height, oldWidth, oldHeight) {
                            console.log(width, height)
                        }
                    }
                }
            });
            setTablaCmp(btn);
            window.addEventListener('resize', handleResize)
        }
    }
    useEffect(() => {
        console.time("entrando a renderizar")
        getDatosTabla();
        initComponentes();
        console.timeEnd("finalizo")
    }, [loadCmp])
    return (
        <div className='fondoInicial vh-100' onLoad={() => initComponentes()} style={{paddingTop:'70px'}}>
            <div className='bg-dark bg-gradient text-center text-light'>
                Tabla de prueba
            </div>
            <div className='w-100' id='botonPrueba' ref={cmpTabla}></div>
        </div>
    )
}

export default TablaView
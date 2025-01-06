import React, { useEffect, useRef } from 'react'

function PruebaExt() {
    const refContenedor = useRef();
    function saludar() {
        console.log("saludar ")
    }
    useEffect(() => {
        Ext.create({
            xtype: "component",
            cls: 'w-100 bg-transparent',
            
            height: Ext.getBody().getViewSize().height - 58,
            flex: 1,
            border: false,
            autoEl: {
                tag: "iframe",
                src: "/vistas/pruebaMapa.html",
            },
            listeners: {
                resize: function (width, height, oldWidth, oldHeight, eOpts) {
                    console.log("cabio tamanio");
                }
            },
            renderTo: 'contenedor'
        })
    }, [])
    return (
        <div ref={refContenedor} className='mapContainer' id='contenedor'></div>
    )
}

export default PruebaExt

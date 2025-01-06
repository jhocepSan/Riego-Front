import React, { useEffect, useState } from 'react'
import MiniMapa from './MiniMapa';

function MapaComparable(props) {
  const { info, geometry } = props;
  const [fechas, setFechas] = useState([5, 4, 3, 2, 1, 0]);
  function getFecha(mes) {
    var fecha = info.observed.split('-')
    var resta = parseInt(fecha[1]) - mes;
    if (resta <= 0) {
      fecha[0] = fecha[0] - 1;
      fecha[1] = 12 + resta;
    } else {
      fecha[1] = resta < 10 ? `0${resta}` : resta;
    }
    return fecha[0] + '-' + fecha[1]
  }
  function descargarGeometrtia() {
    const blob = new Blob([geometry.geoSelect], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CaminoSeleccionado.geojson'; // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <> <button className='btn btn-sm btn-success' onClick={() => descargarGeometrtia()}>Descargar Geometria Seleccionada</button>
      <div className='row row-cols gx-1'>
        {fechas.map((item, index) => {
          return (
            <div className='col m-1 p-0 mx-auto' style={{ minWidth: '250px', maxWidth: '250px' }} key={index}>
              <div className='text-center text-light'>{`Fecha: ${getFecha(item)}`}</div>
              <MiniMapa geometry={geometry} fecha={getFecha(item)} area={info.object_area_m2} />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MapaComparable

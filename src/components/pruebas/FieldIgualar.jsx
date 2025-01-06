import React from 'react'

function FieldIgualar(props) {
    const { fieldTabla, fieldCapa,collback } = props;
    return (
        <>
            <div className='table-responsive text-center'>
                <table className="table table-dark table-hover table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Campo de la tabla</th>
                            <th scope="col">Campo de la capa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fieldTabla.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th>{item.column_name}</th>
                                    <td>
                                        <select className="form-select form-select-sm" id={`${index}-selector`}>
                                            <option selected value={''}>Ninguno</option>
                                            {fieldCapa.map((itemm, indexx) => {
                                                return (
                                                    <option key={indexx} value={itemm}>{itemm}</option>
                                                )
                                            })}
                                        </select>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='container-fluid mb-1'>
                <button className='btn btn-secondary btn-sm mx-1' onClick={()=>collback(true)}>Guardar</button>
                <button className='btn btn-light btn-sm mx-1' onClick={()=>collback(false)}>Cancelar</button>
            </div>
        </>
    )
}

export default FieldIgualar

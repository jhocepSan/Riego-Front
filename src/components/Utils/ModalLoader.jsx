import React from 'react'
import Modal from 'react-bootstrap/Modal';
import MoonLoader from 'react-spinners/MoonLoader'
function ModalLoader(props) {
    const { show } = props;
    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName='bg-transparent sinBorde'
        >
            <Modal.Body bsPrefix='modal-body bg-transparent mx-auto'>
                <MoonLoader
                    color={'#4000FF'}
                    loading={show}
                    size={150}
                    />
                <div className='fa-fade text-light fw-bold mx-auto text-center' style={{fontSize:'20px'}}>Espere por favor ...</div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalLoader
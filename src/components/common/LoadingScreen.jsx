import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import '../../styles/LoadingScreen.css';  // Arquivo de estilos personalizados

const LoadingModal = ({ show }) => {
  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      fullscreen
      className="loading-modal"
    >
      <Modal.Body className="d-flex justify-content-center align-items-center flex-column">
        <Spinner animation="border" role="status" variant="primary" className="loading-spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div className="loading-text mt-3">Carregando, por favor aguarde...</div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;


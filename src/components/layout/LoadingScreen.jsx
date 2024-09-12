import React from 'react';
import { Spinner, Container } from 'react-bootstrap';
import '../../styles/LoadingScreen.css';  // Arquivo de estilos personalizados

const LoadingScreen = () => {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center loading-container">
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" className="loading-spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div className="loading-text mt-3">Carregando, por favor aguarde...</div>
      </div>
    </Container>
  );
};

export default LoadingScreen;

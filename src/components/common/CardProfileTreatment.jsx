import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa'; // Ícone de fechar

const MessageCard = ({ show, message, isSuccess, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // Fecha o card após 3 segundos
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const cardStyle = {
    backgroundColor: isSuccess ? '#28a745' : '#dc3545', // Verde para sucesso, vermelho para erro
    color: '#fff',
    borderRadius: '5px',
    padding: '20px',
    position: 'fixed',   // Posicionar no topo da tela
    top: '10px',         // Definir uma distância do topo
    left: '50%',
    transform: 'translateX(-50%)', // Centralizar horizontalmente
    zIndex: 1050,         // Garantir que o card fique sobre outros elementos
    width: 'auto',
    maxWidth: '90%',
  };

  return (
    show && (
      <Card style={cardStyle} className="shadow-lg">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h5 className="text-center m-0">{message}</h5>
          <FaTimes
            className="cursor-pointer"
            size={20}
            onClick={onClose}
          />
        </Card.Body>
      </Card>
    )
  );
};


export default MessageCard;

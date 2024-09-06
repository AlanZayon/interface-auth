import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const MyModal = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const handleClose = () => setShow(false);

  useEffect(() => {
    // Verifica o estado passado para decidir se deve abrir o modal
    if (location.state?.show) {
      setShow(true);
    }
  }, [location]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Provider User Not Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          We couldn't find a user associated with this provider. 
          You have been redirected to register a new account.
           Once registered, your provider will be automatically linked to your new account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyModal;

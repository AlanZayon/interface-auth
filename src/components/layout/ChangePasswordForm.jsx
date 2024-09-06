// ChangePasswordForm.js
import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const ChangePasswordForm = ({ onChangePassword }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const currentPassword = event.target.elements.currentPassword.value;
    const newPassword = event.target.elements.newPassword.value;
    const confirmNewPassword = event.target.elements.confirmNewPassword.value;

    if (newPassword !== confirmNewPassword) {
      alert("A nova senha e a confirmação de senha devem ser iguais.");
      return;
    }

    // Chamar a função passada via props para processar a mudança de senha
    onChangePassword(currentPassword, newPassword);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="currentPassword" className="mb-3">
        <Form.Label>Senha Atual</Form.Label>
        <InputGroup>
          <Form.Control type="password" name="currentPassword" />
          <InputGroup.Text>
            <i className="bi bi-eye"></i>
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="newPassword" className="mb-3">
        <Form.Label>Nova Senha</Form.Label>
        <InputGroup>
          <Form.Control type="password" name="newPassword" />
          <InputGroup.Text>
            <i className="bi bi-eye"></i>
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="confirmNewPassword" className="mb-3">
        <Form.Label>Confirme a Nova Senha</Form.Label>
        <InputGroup>
          <Form.Control type="password" name="confirmNewPassword" />
          <InputGroup.Text>
            <i className="bi bi-eye"></i>
          </InputGroup.Text>
        </InputGroup>
        <Button variant="primary" type="submit" className="mt-3">Alterar Senha</Button>
      </Form.Group>
    </Form>
  );
};

export default ChangePasswordForm;

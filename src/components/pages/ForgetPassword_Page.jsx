// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../../styles/ForgetPassword_Page.css'

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = () => {
    // Lógica para enviar e-mail de recuperação
    setStep(2);
  };

  const handlePasswordSubmit = () => {
    // Lógica para redefinir a senha
    if (newPassword === confirmPassword) {
      // Redefinir senha
      setStep(4);
    } else {
      alert('As senhas não coincidem!');
    }
  };

  return (
    <Container>
      {step === 1 && (
        <Row className="justify-content-md-center card-form">
          <Col >
            <h2>Recuperar Senha</h2>
            <Form>
              <Form.Group controlId="formBasicEmail" className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleEmailSubmit}>
                Enviar
              </Button>
            </Form>
          </Col>
        </Row>
      )}
      {step === 2 && (
        <Row className="justify-content-md-center">
          <Col >
            <Alert variant="success">
              Um e-mail com o link de recuperação foi enviado para {email}.
            </Alert>
          </Col>
        </Row>
      )}
      {step === 3 && (
        <Row className="justify-content-md-center card-form">
          <Col >
            <h2>Redefinir Senha</h2>
            <Form>
              <Form.Group controlId="formNewPassword" className='mb-2'>
                <Form.Label>Nova Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword" className='mb-2'>
                <Form.Label>Confirme a Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handlePasswordSubmit}>
                Redefinir Senha
              </Button>
            </Form>
          </Col>
        </Row>
      )}
      {step === 4 && (
        <Row className="justify-content-md-center mb-2">
          <Col >
            <Alert variant="success">
              Sua senha foi redefinida com sucesso!
            </Alert>
            <Button variant="primary" onClick={handlePasswordSubmit}>
                Voltar para o inicio
              </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ForgetPassword;

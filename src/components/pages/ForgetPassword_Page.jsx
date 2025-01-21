// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useForgetPassword } from '../../hooks/useForgetPassword';
import ResetPassword from './Register_Page'
import '../../styles/ForgetPassword_Page.css'

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { mutateAsync: forgetPassword } = useForgetPassword();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera o token da URL
    const urlParams = new URLSearchParams(location.search);
    const step = urlParams.get('step');

    // Verifica se o step está presente
    if (step) {
      setStep(Number(step));
    }
  }, [location.search]);

  const handleEmailSubmit = async () => {
    try {
      await forgetPassword(email);
      setStep(2);
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      setError('Falha ao enviar e-mail.');
    }
  };

  const handlePasswordSubmit = () => {
     navigate('/');
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
              {error && <div className="text-danger mb-2">{error}</div>}
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
            <ResetPassword shouldShowPasswordFields={true} />

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

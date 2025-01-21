// ChangePasswordForm.js
import React, { useState, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  arrow,
} from '@floating-ui/react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';


const ChangePasswordForm = ({setShow, setMessage, setIsSuccess}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const [strengthCriteria, setStrengthCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

    // Estados para controlar a visibilidade de cada campo de senha individualmente
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
    const togglePasswordVisibility = (field) => {
      // Alterna a visibilidade de acordo com o campo
      if (field === 'current') {
        setShowCurrentPassword(!showCurrentPassword);
      } else if (field === 'new') {
        setShowNewPassword(!showNewPassword);
      } else if (field === 'confirm') {
        setShowConfirmNewPassword(!showConfirmNewPassword);
      }
    };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift(), arrow({
      element: arrowRef,
    })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, { enabled: true, toggle: false });
  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      if (!refs.reference.current.contains(event.target) && !refs.floating.current.contains(event.target)) {
        setIsOpen(false);
      }
    },
  });
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const handleFocus = () => {
    setIsOpen(true);

    if (refs.reference.current) {
      refs.reference.current.focus();
    }
  }

  const handleBlur = (event) => {
    if (refs.floating.current && !refs.floating.current.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  const calculateStrength = (password) => {
    let score = 0;
    const criteria = {
      length: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password),
    };

    for (let key in criteria) {
      if (criteria[key]) score++;
    }
    setStrength(score);
    setStrengthCriteria(criteria);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    calculateStrength(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica se a nova senha e a confirmação de senha são iguais
    if (password !== confirmNewPassword) {
      setShow(true);
      setMessage("the new password and the confirmation password don't match");
      setIsSuccess(false);
      return;
    }

    try {
      // Obtém o token de autenticação
      const token = localStorage.getItem('token'); // Ou de onde você estiver armazenando o token

      // Envia a requisição para o backend
      const response = await fetch(`${API_BASE_URL}/admin/resetPassword`, {
        method: 'POST', // Método POST para enviar os dados
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "X-Auth-Type": "JWT" // Enviar o token no cabeçalho da solicitação
        },
        body: JSON.stringify({ // Corpo da requisição com as senhas
          password: currentPassword,
          newPassword: password,
          confirmNewPassword: confirmNewPassword,
        }),
      });



      // Converte a resposta em JSON
      const result = response;

      // Exibe uma mensagem de sucesso ou erro
      if (result.status === 200) {
        setShow(true);
        setMessage('password changed successfully');
        setIsSuccess(true);
        setCurrentPassword('');
        setPassword('');
        setConfirmNewPassword('');
      } else {
        setShow(true);
        setMessage(await result.text());
        setIsSuccess(false);
      }
    } catch (error) {
      // Em caso de erro, exibe a mensagem de erro
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="currentPassword" className="mb-3">
        <Form.Label>Senha Atual</Form.Label>
        <InputGroup>
          <Form.Control
            type={showCurrentPassword ? 'text' : 'password'} // Mostra ou oculta a senha dependendo do estado
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        <InputGroup.Text onClick={() => togglePasswordVisibility('current')} style={{ cursor: 'pointer' }}>
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />} {/* Muda o ícone conforme o estado */}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="newPassword" className="mb-3">
        <Form.Label>Nova Senha</Form.Label>
        <InputGroup>
          <Form.Control
            type={showNewPassword ? 'text' : 'password'} // Mostra ou oculta a senha dependendo do estado
            name="newPassword"
            value={password}
            onChange={handlePasswordChange}
            ref={refs.setReference}
            {...getReferenceProps({ onFocus: handleFocus, onBlur: handleBlur })}
          />
          <PasswordStrengthMeter
            isOpen={isOpen}
            strengthCriteria={strengthCriteria}
            strength={strength}
            refs={refs}
            floatingStyles={floatingStyles}
            getFloatingProps={getFloatingProps}
            context={context}
            arrowRef={arrowRef}
          />
          <InputGroup.Text onClick={() => togglePasswordVisibility('new')} style={{ cursor: 'pointer' }}>
            {showNewPassword ? <FaEyeSlash /> : <FaEye />} {/* Muda o ícone conforme o estado */}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="confirmNewPassword" className="mb-3">
        <Form.Label>Confirme a Nova Senha</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmNewPassword ? 'text' : 'password'} // Mostra ou oculta a senha dependendo do estado
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <InputGroup.Text onClick={() => togglePasswordVisibility('confirm')} style={{ cursor: 'pointer' }}>
            {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />} {/* Muda o ícone conforme o estado */}
          </InputGroup.Text>
        </InputGroup>
        <Button variant="primary" type="submit" className="mt-3">Alterar Senha</Button>
      </Form.Group>
    </Form>
  );
};

export default ChangePasswordForm;

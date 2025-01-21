import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Função que simula o envio de código de verificação
const sendVerificationCode = async (email) => {
    // Ao sair do input, envia a atualização para o backend
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/admin/code`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Auth-Type": "JWT"
        },
        body: JSON.stringify({ newEmail: email }),
    });

    const data = await response;
    if (!response.ok) {
        return data;
    } else {
        return data;
    }
};

// Função que simula a verificação do código
const verifyCode = async (code) => {
    // Ao sair do input, envia a atualização para o backend
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/admin/verificationCode`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Auth-Type": "JWT"
        },
        body: JSON.stringify({ codeToChangeEmail: code }),
    });

    const data = await response;
    if (!response.ok) {
        return data;
    } else {
        return data;
    }
};

const ChangeEmailModal = ({ showModal, onHide, setShow, setMessage, setIsSuccess, setEmail }) => {
    const [step, setStep] = useState(1); // Controle das etapas do modal
    const [newEmail, setNewEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => setNewEmail(e.target.value);
    const handleCodeChange = (e) => setVerificationCode(e.target.value);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNextStep = async () => {
        setError('');
        setLoading(true);

        if (step === 1) {
            // Etapa 1: Enviar código de verificação para o novo email

            // Verificar se o email tem um formato válido
            if (!isValidEmail(newEmail)) {
                setError('Por favor, insira um endereço de email válido.');
                setLoading(false);
                return;
            }

            const data = await sendVerificationCode(newEmail);
            if (data.status === 400) {
                setError(await data.text());
            } else {
                setStep(2);
            }

        } else if (step === 2) {
            // Etapa 2: Verificar o código enviado
            const data = await verifyCode(verificationCode);
            if (data.status === 400) {
                setError(await data.text());
            } else {
                setEmail(newEmail);
                setShow(true);
                setMessage('Email changed successfully!');
                setIsSuccess(true);
                handleCloseModal();
            }
        }

        setLoading(false);
    };

    const handleCloseModal = () => {
        setStep(1); // Reiniciar a etapa
        setNewEmail('');
        setVerificationCode('');
        setError('');
        onHide();
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Alterar Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <>
                        <Form.Group>
                            <Form.Label>Digite o novo email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Novo email"
                                value={newEmail}
                                onChange={handleEmailChange}
                            />
                        </Form.Group>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Form.Group>
                            <Form.Label>Digite o código de verificação enviado para {newEmail}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Código de verificação"
                                value={verificationCode}
                                onChange={handleCodeChange}
                            />
                        </Form.Group>
                    </>
                )}

                {error && <div className="text-danger">{error}</div>}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleNextStep}
                    disabled={loading}
                >
                    {loading ? 'Carregando...' : step === 1 ? 'Enviar Código' : 'Verificar Código'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeEmailModal;

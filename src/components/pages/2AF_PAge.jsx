import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const TwoFactorAuthPage = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { setLoading, setRedirect } = useLoading();
    const [code, setCode] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isCodeVerified) {
            setLoading(true);
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // User is signed in, get the token and fetch data
                    const token = await user.getIdToken();
                    verifyCode(token, "Firebase");
                } else {
                    // No user is signed in, try to use local token
                    const localToken = localStorage.getItem("token");
                    if (localToken) {
                        verifyCode(localToken, "JWT");
                    }
                }
            });

            return () => unsubscribe(); // Cleanup on unmount
        }
    }, [isCodeVerified]);

    const verifyCode = async (token, authType) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/verify-2fa`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    "X-Auth-Type": authType
                },
                body: JSON.stringify({
                    token: code.join(''),
                }),
            });

            if (!response.ok) {
                setLoading(false);
                setIsCodeVerified(false);
                throw new Error('Failed to verify code');
            }

            const data = await response.json();
            if (data.success) {
                setLoading(false);
                setError('');
                setRedirect(true);
                navigate("/profile");
            } else {
                setError('Código inválido. Tente novamente.');
            }
        } catch (err) {
            setError('Código inválido. Tente novamente.');
            console.error('Error verifying code', err);
        }
    };

    const handleChange = (e, index) => {
        const newCode = [...code];
        const value = e.target.value.slice(-1); // Ensure only one character is stored
        newCode[index] = value;
        setCode(newCode);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && !code[index]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const codeString = code.join('');
        // Add your 2FA verification logic here
        if (codeString) {
            setIsCodeVerified(true);
        } else {
            setError('Invalid code. Please try again.');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Two-Factor Authentication</h2>
            <Card className="p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="justify-content-center mb-3">
                        {code.map((digit, index) => (
                            <Col key={index} xs={3} sm={2}>
                                <Form.Control
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    maxLength="1"
                                    className="text-center"
                                    required
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    style={{
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 1)',
                                        margin: '0 5px'
                                    }}
                                />
                            </Col>
                        ))}
                    </Form.Group>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button type="submit" className="w-100">Verify</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default TwoFactorAuthPage;

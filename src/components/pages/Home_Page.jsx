// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Container } from 'react-bootstrap';
import '../../styles/Home_Page.css';
import { useAuth } from "../../hooks/useAuth";
import { useLogin } from "../../hooks/useLogin";
import SocialLoginButtons from "../layout/SocialLoginButtons ";
import LoginForm from "../layout/LoginForm";


function Home() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useAuth();
    const loginUser = useLogin(setErrorMessage);

    const handleLogin = (e) => {
        e.preventDefault(); // Adiciona essa linha para prevenir o reload
        setErrorMessage(null);
        loginUser({ email, password });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const goToAbout = () => {
        navigate('/Register');
    };

    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6} className="text-left">
                    <h1 style={{ fontSize: '3rem' }}>Stickerbush</h1>
                    <p style={{ fontSize: '1.5rem' }}>
                        Inspirado no significado da musica Stickerbush do Donkey Kong Country 2,
                        criei esse site para que possamos nos expressar e compartilhar com novas
                        pessoas o que estamos sentindo enquanto escutamos esse clássico das
                        trilhas sonoras dos games.
                    </p>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                    <LoginForm
                        email={email}
                        password={password}
                        showPassword={showPassword}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        toggleShowPassword={toggleShowPassword}
                        handleLogin={handleLogin}
                        errorMessage={errorMessage}
                        showExtrasButtons={true} // Exibe os botões sociais e texto adicional
                        goToAbout={goToAbout}
                        SocialLoginButtons={SocialLoginButtons}
                    />
                </Col>
                <Card.Footer className="footer">
                    © 2024 Stickerbush
                </Card.Footer>
            </Row>
        </Container>
    );
}


export default Home;




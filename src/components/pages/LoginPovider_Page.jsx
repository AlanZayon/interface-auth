import React, { useState } from "react";
import { Container } from 'react-bootstrap';
import LoginForm from "../layout/LoginForm";
import { useLogin } from "../../hooks/useLogin";


function LoginProvider() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const loginUser = useLogin(setErrorMessage);

    const handleLogin = (e) => {
        e.preventDefault(); // Adiciona essa linha para prevenir o reload
        setErrorMessage(null);
        loginUser({ email, password });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container>
            <LoginForm
                        email={email}
                        password={password}
                        showPassword={showPassword}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        toggleShowPassword={toggleShowPassword}
                        handleLogin={handleLogin}
                        errorMessage={errorMessage}
                        showExtrasText={true} // Exibe os botões sociais e texto adicional
                    />
        </Container>
    );

}

export default LoginProvider;
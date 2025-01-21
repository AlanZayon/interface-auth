import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({
    email,
    password,
    showPassword,
    setEmail,
    setPassword,
    toggleShowPassword,
    handleLogin,
    errorMessage,
    showExtrasText,
    showExtrasButtons,
    goToAbout,
    SocialLoginButtons
}) => {
    return (
        <Form className="login-form" onSubmit={handleLogin}>
            {showExtrasText && (
                <div className="mb-3">
                    <h2>We find a user with the same credentials, log in to automatically link the provider to the user.</h2>
                </div>
            )}
            <Form.Group controlId="formEmail">
                <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formPassword" className="position-relative">
                <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={toggleShowPassword}
                    className="password-icon"
                />
            </Form.Group>
            <Form.Text className="text-muted text-end">
                <a href="/forget-password">Forgot password?</a>
            </Form.Text>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Button variant="primary" type="submit" size="md">Login</Button>
            {showExtrasButtons && (
                <>
                    <Button variant="secondary" size="md" onClick={goToAbout}>Create Account</Button>
                    <SocialLoginButtons />
                </>
            )}
        </Form>
    );
};

export default LoginForm;

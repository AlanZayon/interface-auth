// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import PasswordStrengthMeter from '../layout/PasswordStrengthMeter';
import ErrorMessage from '../layout/ErrorMessage';
import useForm from '../../hooks/useForm';
import { useRegister } from "../../hooks/useRegister";
import { useResetPassword } from '../../hooks/useForgetPassword';
import MyModal from '../common/Modal'
import '../../styles/Register_Page.css'

function Register({ shouldShowPasswordFields }) {
  const { handleRegister } = useRegister();
  const { mutateAsync: resetPassword } = useResetPassword();
  const handleSubmitFunction = shouldShowPasswordFields ? resetPassword : handleRegister;
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handlePasswordChange,
    strength,
    strengthCriteria,
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    handleFocus,
    handleBlur,
    arrowRef,
    context,
  } = useForm({
    handleRegister: handleSubmitFunction,
    shouldShowPasswordFields
  });


  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <div className="form-box">
            <Form onSubmit={handleSubmit}>
              {shouldShowPasswordFields ? (
                <>
                  <Form.Group controlId="formPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
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
                    <ErrorMessage error={errors.password} />
                  </Form.Group>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <ErrorMessage error={errors.confirmPassword} />
                  </Form.Group>
                </>
              ) : (
                <>
                  <h2>Register</h2>

                  <Form.Group controlId="formUsername">
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <ErrorMessage error={errors.username} />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <ErrorMessage error={errors.email} />
                  </Form.Group>
                  <Form.Group controlId="formConfirmEmail">
                    <Form.Control
                      type="email"
                      placeholder="Confirm Email"
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                    />
                    <ErrorMessage error={errors.confirmEmail} />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
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
                    <ErrorMessage error={errors.password} />
                  </Form.Group>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <ErrorMessage error={errors.confirmPassword} />
                  </Form.Group>

                  {/* Campo de Data de Nascimento */}
                  <Form.Group controlId="formDOB">
                    <Form.Control
                      type="date"
                      placeholder="mm/dd/yyyy"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />

                    <ErrorMessage error={errors.dateOfBirth} />

                  </Form.Group>
                </>
              )}
              <Button variant="success" type="submit">Register</Button>
            </Form>
          </div>
        </Col>
      </Row>

      <MyModal />

    </Container>

  );
}

export default Register;
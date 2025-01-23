// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import '../../styles/Home_Page.css';


function confirmEmail() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                const localToken = localStorage.getItem("token");
                if (localToken) {
                    navigate("/");
                }
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6} className="text-left">
                    <h1 style={{ fontSize: '3rem' }}>Confirm Email</h1>
                    <p style={{ fontSize: '1.5rem' }}>
                        A verify link has been sent to your email. Please check your inbox and
                        follow the instructions. You have at least 1 hour to verify your account,if limite time passed, remake
                        your register.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}


export default confirmEmail;




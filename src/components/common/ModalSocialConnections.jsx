import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useLoading } from '../context/LoadingContext';

import SocialLoginButtons from '../layout/SocialLoginButtons ';

function SettingsModal({ show, handleClose, enable2FAAuth }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { setLoading } = useLoading();
  const [is2FAEnabled, setIs2FAEnabled] = useState(null);
  const [is2FAEnabledIcon, setIs2FAEnabledIcon] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    setIs2FAEnabledIcon(enable2FAAuth);
  }, [enable2FAAuth]);

  useEffect(() => {
    // 2FAEnabled é explicitamente true ou false
    if (typeof is2FAEnabled !== "boolean") {
      return;
    }

    if (is2FAEnabled) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, get the token and fetch data
          const token = await user.getIdToken();
          enable2FA(token, "Firebase");
        } else {
          // No user is signed in, try to use local token
          const localToken = localStorage.getItem("token");
          if (localToken) {
            enable2FA(localToken, "JWT");
          }
        }
      });

      return () => unsubscribe(); // Cleanup on unmount
    } else if (!is2FAEnabled) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, get the token and fetch data
          const token = await user.getIdToken();
          disable2FA(token, "Firebase");
        } else {
          // No user is signed in, try to use local token
          const localToken = localStorage.getItem("token");
          if (localToken) {
            disable2FA(localToken, "JWT");
          }
        }
      });

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [is2FAEnabled]);

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

  const handle2FAToggle = () => {
    setIs2FAEnabled(prevState => !prevState);
    setIs2FAEnabledIcon(prevState => !prevState);
  };

  const handleverifyCode = () => {
    setIsCodeVerified(true);
  };

  const enable2FA = async (token, authType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/enable-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "X-Auth-Type": authType
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setQrCode(data.qrCodeUrl);
      setIsCodeSent(true);
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const disable2FA = async (token, authType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/disable-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "X-Auth-Type": authType
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setIsCodeSent(false);
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

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
          token: verificationCode,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        setIsCodeVerified(false);
        setVerificationCode('');
        throw new Error('Failed to verify code');
      }

      const data = await response.json();
      if (data.success) {
        setLoading(false);
        setVerificationCode('');
        setError('');
      } else {
        setError('Código inválido. Tente novamente.');
      }
    } catch (err) {
      setError('Código inválido. Tente novamente.');
      console.error('Error verifying code', err);
    }
  };


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Account Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>Connect Your Accounts</h5>
          <SocialLoginButtons linkConnect={true} />
        </div>
        <hr />
        <div className="mb-3">
          <h5>Two-Factor Authentication</h5>
          <Form.Check
            type="switch"
            id="enable-2fa"
            label="Enable 2FA"
            checked={is2FAEnabledIcon || false}
            onChange={handle2FAToggle}
          />
          {is2FAEnabled && (
            <div className="mt-3">
              {isCodeVerified ? (
                <Alert variant="success" className="mt-2">
                  Two-Factor Authentication has been successfully enabled!
                </Alert>
              ) : (
                !isCodeSent ? (
                  <p>Follow the instructions to enable Two-Factor Authentication.</p>
                ) : (
                  <>
                    <p>Scan the QR Code below with your authentication app (e.g., Google Authenticator):</p>
                    <img src={qrCode} alt="QR Code for 2FA" />
                    <Form.Control
                      type="text"
                      placeholder="Enter the code from your app"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="mt-2"
                    />
                    <Button variant="primary" onClick={handleverifyCode} className="mt-2">
                      Verify Code
                    </Button>
                    {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                  </>
                )
              )}

            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsModal;

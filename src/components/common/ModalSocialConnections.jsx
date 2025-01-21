import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import SocialLoginButtons from '../layout/SocialLoginButtons ';

function SettingsModal({ show, handleClose }) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handle2FAToggle = () => {
    setIs2FAEnabled(prevState => !prevState);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Account Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>Connect Your Accounts</h5>
            <SocialLoginButtons linkConnect={true}/>
        </div>
        <hr />
        <div>
          <h5>Two-Factor Authentication</h5>
          <Form.Check 
            type="switch"
            id="enable-2fa"
            label="Enable 2FA"
            checked={is2FAEnabled}
            onChange={handle2FAToggle}
          />
          {is2FAEnabled && (
            <div className="mt-3">
              <p>Two-Factor Authentication is enabled. Follow the instructions sent to your email to complete the setup.</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => alert('Settings Saved')}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsModal;

import React from "react";
import { Button } from "react-bootstrap";
import useLoginWithGoogle from "../../hooks/useLoginWithGoogle ";
import useLoginWithFacebook from "../../hooks/useLoginWithFacebook";

const SocialLoginButtons = () => {
  const { mutate: loginWithGoogle } = useLoginWithGoogle();
  const { mutate: loginWithFacebook } = useLoginWithFacebook();

  return (
    <div>
      <Button variant="outline-danger" onClick={() => loginWithGoogle()}>
        Login with Google
      </Button>
      <Button variant="outline-primary" onClick={() => loginWithFacebook()}>
        Login with Facebook
      </Button>
    </div>
  );
};

export default SocialLoginButtons;

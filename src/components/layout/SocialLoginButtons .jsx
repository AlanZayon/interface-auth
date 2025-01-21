import React,{useState}from "react";
import { Button } from "react-bootstrap";
import { FaGoogle} from 'react-icons/fa';
import { useLoginWithGoogle, useLinkGoogleAccount } from "../../hooks/useLoginWithGoogle ";
// import useLoginWithFacebook from "../../hooks/useLoginWithFacebook";

const SocialLoginButtons = ({ linkConnect }) => {
  const [message, setMessage] = useState("");
  const { mutate: loginWithGoogle } = useLoginWithGoogle();
  const { mutate: linkGoogleAccount } = useLinkGoogleAccount(setMessage);
  // const { mutate: loginWithFacebook } = useLoginWithFacebook();

  return (
    <div>
      <Button
        variant="danger"
        className="d-flex align-items-center mb-2"
        onClick={() => linkConnect ? linkGoogleAccount() : loginWithGoogle()}
      >
        <FaGoogle className="mx-2" /> Connect with Google
      </Button>
      {message && <p>{message}</p>}
      {/* <Button variant="primary" className="d-flex align-items-center" onClick={() => loginWithFacebook()}>
        <FaFacebook className="mx-2" /> Connect with Facebook
      </Button> */}
    </div>
  );
};

export default SocialLoginButtons;

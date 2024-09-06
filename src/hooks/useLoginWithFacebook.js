import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { auth } from "../services/firebaseConfig";
import {
    signInWithPopup,
    FacebookAuthProvider
} from "firebase/auth";

const useLoginWithFacebook = () => {

    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    return useMutation({
        mutationFn: async () => {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);

            if (!result) {
                throw new Error("No result returned from signInWithPopup.");
            }

            const user = result.user;
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const additionalUserInfo = result._tokenResponse.isNewUser;

            if (additionalUserInfo) {
                // If new user, handle registration
                return { user, credential, isNewUser: true };
            } else {
                // Existing user
                return { user, credential, isNewUser: false };
            }
        },
        onSuccess: async ({ user, credential, isNewUser }) => {
            if (isNewUser) {
                redirectToRegistration(user, credential, navigate);
            } else {
                await handleExistingUser(user, navigate, API_BASE_URL);
            }
        },
        onError: (error) => {
            console.error("Error during Facebook login:", error);
            let credential = null;

            if (error.code === "auth/account-exists-with-different-credential") {
                try {
                    // Extract credential from the error using providerId
                    credential = FacebookAuthProvider.credentialFromError(error);
                } catch (ex) {
                    console.error("Failed to extract credential from error", ex);
                }

                if (credential) {
                    sessionStorage.setItem("pendingCred", JSON.stringify(credential));
                }

                sessionStorage.setItem("emailForSignIn", error.customData.email);
                navigate("/loginProvider");
            }
        },
    });
};

const redirectToRegistration = (user, credential, navigate) => {
    const nome = user.displayName;
    const email = user.email;
    const nomeEncoded = encodeURIComponent(nome);
    const emailEncoded = encodeURIComponent(email);
    sessionStorage.setItem("credential", JSON.stringify(credential));
    navigate(`/register?name=${nomeEncoded}&email=${emailEncoded}`, { state: { show: true } });
};

const handleExistingUser = async (user, navigate, API_BASE_URL) => {
    const userId = await user.getIdToken(true);
    if (userId) {
        const response = await fetch(`${API_BASE_URL}/user/check-firebase-user`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + userId,
                "X-Auth-Type": "Firebase"
            },
        });
        const data = await response.json();
        if (data.userExists && data.verifyStatus === true) {
            navigate("/profile");
        } else {
            navigate();
        }
    }
};

export default useLoginWithFacebook;

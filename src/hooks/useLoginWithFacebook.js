import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../services/firebaseConfig";
import {
    signInWithRedirect,
    getRedirectResult,
    FacebookAuthProvider
} from "firebase/auth";

const useLoginWithFacebook = () => {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Mutation for initiating Facebook login via redirect
    const mutation = useMutation({
        mutationFn: async () => {
            const provider = new FacebookAuthProvider();
            await signInWithRedirect(auth, provider);
            // No result will be returned here because this will redirect
        },
        onError: (error) => {
            console.error("Error during Facebook login:", error);
        },
    });

    // Handle the result of Facebook login after redirect
    useEffect(() => {
        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const user = result.user;
                    console.log("User after redirect:", user); // Log the user to the console

                    const credential = FacebookAuthProvider.credentialFromResult(result);
                    const additionalUserInfo = result._tokenResponse.isNewUser;

                    if (additionalUserInfo) {
                        // If new user, handle registration
                        redirectToRegistration(user, credential, navigate);
                    } else {
                        // Existing user
                        await handleExistingUser(user, navigate, API_BASE_URL);
                    }
                }
            } catch (error) {
                console.error("Error after Facebook login redirect:", error);
            }
        };

        checkRedirectResult();
    }, [navigate, API_BASE_URL]);

    return mutation;
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

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../components/context/LoadingContext'; 
import { auth } from "../services/firebaseConfig";
import {
    FacebookAuthProvider,
    signInWithCredential
} from "firebase/auth";

// Função para inicializar o SDK do Facebook
const initializeFacebookSDK = () => {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '1105932533913687', // Substitua pelo seu Facebook App ID
            xfbml: true,
            version: 'v20.0'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

const useLoginWithFacebook = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoading();  
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Initialize Facebook SDK
    useEffect(() => {
        initializeFacebookSDK();
    }, []);

    // Mutation for initiating Facebook login
    const mutation = useMutation({
        mutationFn: async () => {
            setLoading(true); 
            return new Promise((resolve, reject) => {
                FB.login((response) => {
                    if (response.authResponse) {
                        const { accessToken } = response.authResponse;
                        try {
                            // Create a Firebase credential with the Facebook access token
                            const credential = FacebookAuthProvider.credential(accessToken);
                            // Resolver a promise do Firebase Auth manualmente
                            signInWithCredential(auth, credential)
                                .then((result) => {

                                    if (result) {
                                        const user = result.user;

                                        const credential = FacebookAuthProvider.credentialFromResult(result);
                                        const additionalUserInfo = result._tokenResponse.isNewUser;

                                        if (additionalUserInfo) {
                                            // If new user, handle registration
                                            redirectToRegistration(user, credential, navigate);
                                        } else {
                                            // Existing user
                                            handleExistingUser(user, navigate, API_BASE_URL);
                                        }
                                    }
                                    resolve(result);
                                })
                                .catch((error) => {
                                    console.error("Firebase credential error:", error);
                                    reject(error);
                                });
                        } catch (error) {
                            console.error("Firebase credential error:", error);
                            reject(error);
                        }
                    } else {
                        console.error("Facebook login response error:", response);
                        reject(new Error("User cancelled login or failed to authenticate."));
                    }
                }, { scope: 'email,public_profile' });
            });
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
        onSettled: () => {
            setLoading(false); 
        }
    });

    return mutation;
};

// Handle registration for new users
const redirectToRegistration = (user, credential, navigate) => {
    const nome = user.displayName;
    const email = user.email;
    const nomeEncoded = encodeURIComponent(nome);
    const emailEncoded = encodeURIComponent(email);
    sessionStorage.setItem("credential", JSON.stringify(credential));
    navigate(`/register?name=${nomeEncoded}&email=${emailEncoded}`, { state: { show: true } });
};

// Handle existing users
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
            navigate("/confirmEmail"); // Redireciona para uma rota apropriada, caso o usuário não esteja verificado
        }
    }
};

export default useLoginWithFacebook;

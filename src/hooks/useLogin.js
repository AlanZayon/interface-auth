import { useMutation } from "@tanstack/react-query";
import { signInWithCustomToken, GoogleAuthProvider, FacebookAuthProvider, linkWithCredential } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from "../services/firebaseConfig";
import { useLoading } from '../components/context/LoadingContext'; 

export const useLogin = (setErrorMessage) => {
    const navigate = useNavigate();
    const { setLoading, setRedirect2AF, setRedirect } = useLoading();  
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { mutate: loginUser } = useMutation({
        mutationFn: async ({ email, password }) => {
            setLoading(true); 
            const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            return response;
        },
        onSuccess: async (response) => {
            const token =  response.headers.get("Authorization-token").split(" ")[1];
            const data = await response.json()
            const userCredential = await signInWithCustomToken(auth, data.firebaseToken);
            await handleAdditionalUserInfo(userCredential);
            if (data.verifyStatus === true && !data.enable2FA) {
                localStorage.setItem("token", token);
                setRedirect(true);
                navigate("/profile");
            }else if(data.enable2FA === true){
                setRedirect2AF(true);
                navigate("/2fa");
            }else {
                setRedirect(true);
                navigate("/confirmEmail");
            }
        },
        onError: () => {
            setErrorMessage("email or password incorrect");
        },
        onSettled: () => {
            setLoading(false); 
        }
    });

    const handleAdditionalUserInfo = async (userCredential) => {
        const pendingCred = JSON.parse(sessionStorage.getItem("pendingCred"));
        const emailForSignIn = sessionStorage.getItem("emailForSignIn");

        if (pendingCred && emailForSignIn && userCredential.user.email === emailForSignIn) {
            try {
                let credential;
                if (pendingCred.providerId === GoogleAuthProvider.PROVIDER_ID) {
                    credential = GoogleAuthProvider.credential(pendingCred.idToken);
                } else if (pendingCred.providerId === FacebookAuthProvider.PROVIDER_ID) {
                    credential = FacebookAuthProvider.credential(pendingCred.accessToken);
                }
                await linkWithCredential(userCredential.user, credential);
                sessionStorage.removeItem("pendingCred");
                sessionStorage.removeItem("emailForSignIn");
            } catch (linkError) {
                console.error("Error linking credentials:", linkError);
            }
        }
    };

    return loginUser;
};

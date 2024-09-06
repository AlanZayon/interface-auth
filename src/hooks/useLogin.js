import { useMutation } from "@tanstack/react-query";
import { signInWithCustomToken, GoogleAuthProvider, FacebookAuthProvider, linkWithCredential } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from "../services/firebaseConfig";

export const useLogin = (setErrorMessage) => {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { mutate: loginUser } = useMutation({
        mutationFn: async ({ email, password }) => {
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
            const token = await response.headers.get("Authorization-token").split(" ")[1];
            const data = await response.json()
            const userCredential = await signInWithCustomToken(auth, data.firebaseToken);
            await handleAdditionalUserInfo(userCredential);
            if (data.verifyStatus) {
                localStorage.setItem("token", token);
                navigate("/profile");
            } else {
                navigate("/");
            }
        },
        onError: (err) => {

            setErrorMessage("email or password incorrect");
        },
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

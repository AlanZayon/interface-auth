import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../components/context/LoadingContext'; 
import { auth } from "../services/firebaseConfig";
import {
    signInWithPopup,
    GoogleAuthProvider,
    unlink,
    signOut,
} from "firebase/auth";

const useLoginWithGoogle = () => {

    const navigate = useNavigate();
    const { setLoading } = useLoading();  
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    return useMutation({
        mutationFn: async () => {
            setLoading(true); 
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            if (!result) {
                throw new Error("No result returned from signInWithPopup.");
            }

            const user = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const additionalUserInfo = result._tokenResponse.isNewUser;

            const response = await fetch(`${API_BASE_URL}/user/check-email?email=${user.email}`);
            const data = await response.json();

            const idTokenResult = await user.getIdTokenResult();
            const alreadyUnlinked = idTokenResult.claims.alreadyUnlinked;

            if (data.userExists && data.signInMethods.includes("google.com") && !alreadyUnlinked && !additionalUserInfo) {


                await unlink(user,GoogleAuthProvider.PROVIDER_ID);
                sessionStorage.setItem("pendingCred", JSON.stringify(credential));
                sessionStorage.setItem("emailForSignIn", user.email);

                await fetch(`${API_BASE_URL}/user/update-profile`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uid: user.uid,
                        customClaims: { alreadyUnlinked: true }
                    })
                });

                await signOut(auth);
                navigate("/loginProvider");
            }

            if (additionalUserInfo) {
                // If new user, handle registration
                return { user, credential, isNewUser: true };
            } else {
                // Existing user
                return { user, credential, isNewUser: false, alreadyUnlinked };
            }
        },
        onSuccess: async ({ user, credential, isNewUser, alreadyUnlinked }) => {
            if (isNewUser) {
                redirectToRegistration(user, credential, navigate);
            } else if(alreadyUnlinked) {
                await handleExistingUser(user, navigate, API_BASE_URL);
            }
        },
        onError: (error) => {
            console.error("Error during Google login:", error);
            let credential = null;

            if (error.code === "auth/account-exists-with-different-credential") {
                try {
                    // Extract credential from the error using providerId
                    credential = GoogleAuthProvider.credentialFromError(error);
                } catch (ex) {
                    console.error("Failed to extract credential from error", ex);
                }

                if (credential) {
                    sessionStorage.setItem("pendingCred", JSON.stringify(credential));
                }

                sessionStorage.setItem("emailForSignIn", error.customData.email);
                // navigate("/loginProvider");
            }
        },
        onSettled: () => {
            setLoading(false); 
        }
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
            navigate("/confirmEmail");
        }
    }
};

export default useLoginWithGoogle;

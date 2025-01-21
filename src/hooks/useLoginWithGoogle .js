import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../components/context/LoadingContext';
import { auth } from "../services/firebaseConfig";
import {
    signInWithPopup,
    GoogleAuthProvider,
    unlink,
    signOut,
    linkWithCredential,
    deleteUser,
    signInWithCredential,
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


                await unlink(user, GoogleAuthProvider.PROVIDER_ID);
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
            } else if (alreadyUnlinked) {
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

const useLinkGoogleAccount = (handleMessage) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { setLoading } = useLoading();

    return useMutation({
        mutationFn: async () => {
            setLoading(true);
            await auth.currentUser?.reload(); // Recarrega o estado do usuário atual
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User is not authenticated.");
            }


            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const resultUser = result.user;

            if (!result) {
                throw new Error("No result returned from signInWithPopup.");
            }

            const credential = GoogleAuthProvider.credentialFromResult(result);

            if (!credential) {
                throw new Error("No credential returned from result.");
            }

            const isMongoObjectId = (uid) => /^[a-fA-F0-9]{24}$/.test(uid); // Regex para verificar ObjectId do MongoDB

            const resultUserUidIsMongoObjectId = isMongoObjectId(resultUser.uid);

            // Check if the Google account is already linked
            const linkedAccounts = user.providerData.map(provider => provider.providerId);
            console.log("linked: ", linkedAccounts);
            console.log("result: ", credential);
            console.log("user: ", user);
            if (linkedAccounts.includes(GoogleAuthProvider.PROVIDER_ID) && user.uid !== resultUser.uid && !resultUserUidIsMongoObjectId) {
                // Unlink the existing Google account
                await unlink(user, GoogleAuthProvider.PROVIDER_ID);
                await deleteUser(result.user);
                await linkWithCredential(user, credential);
                await signInWithCredential(auth, credential);
            } else if (!linkedAccounts.includes(GoogleAuthProvider.PROVIDER_ID) && user.uid !== resultUser.uid && !resultUserUidIsMongoObjectId) {
                await deleteUser(result.user);
                await linkWithCredential(user, credential);
                await signInWithCredential(auth, credential);
            } else if (user.uid !== resultUser.uid && resultUserUidIsMongoObjectId) {
                await linkWithCredential(user, credential);
            }

            // Link the new Google account
            return { user };
        },
        onSuccess: async ({ user }) => {
            console.log("Successfully linked Google account:", user);

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
            handleMessage("Successfully linked Google account.");
            setLoading(false);


            // Handle successful linking (e.g., show success message)
        },
        onError: async (error) => {
            console.log(error);
            await signOut(auth);

            if (error.code === 'auth/credential-already-in-use') {
                console.error("The account is already linked to another user.");
                handleMessage("The account is already linked to another user.");
                // Handle the case where the account is linked to another user
            } else {
                console.error("Error linking Google account:", error);
                // Handle other errors (e.g., show error message)
            }
        }
    });
};

export { useLoginWithGoogle, useLinkGoogleAccount };

// src/hooks/useRegister.js
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { useMainFunction } from './useRealizeUid'
import { auth } from "../services/firebaseConfig";
import { useSendEmail } from "./useSendEmail";
import { useLoading } from '../components/context/LoadingContext'; 
import {
    createUserWithEmailAndPassword,
    signInWithCustomToken,
    onAuthStateChanged,
    GoogleAuthProvider,
    FacebookAuthProvider,
    reauthenticateWithCredential,
    linkWithCredential,
    unlink,
    signOut
} from "firebase/auth";


export function useRegister() {
    const { sendEmail } = useSendEmail();
    const { userUid } = useMainFunction();
    const navigate = useNavigate();
    const { setLoading } = useLoading();  
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Função para registrar o usuário no backend
    const registerUser = async (newUser) => {
        const response = await fetch(`${API_BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(newUser),
        });

        const message = await response.json();

        if (!response.ok) {
            return message;
        }

        const data = message;

        return data;
    };

    const registerMutation = useMutation({ mutationFn: registerUser },);

    const handleRegister = async (formData, setValidationErrors, validationErrors) => {
        setLoading(true); 

        let externalErrors = { ...validationErrors };


        try {
            let data;

            if (!userUid) {


                // Cria o usuário com Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                // Obter ID Token do usuário
                const firebaseUid = await user.getIdToken();

                // Registrar o usuário no backend
                data = await registerMutation.mutateAsync({ ...formData, firebaseUid });
                if (data.errors) {
                    await user.delete();
                    externalErrors = {
                        ...externalErrors,
                        ...handleBackendErrors(data.errors)
                    };
                }

            } else {
                // Registrar o usuário no backend
                data = await registerMutation.mutateAsync({ ...formData, firebaseUid: userUid });
                if (data.errors) {
                    await user.delete();
                    externalErrors = {
                        ...externalErrors,
                        ...handleBackendErrors(data.errors)
                    };
                }

            }

            // Monitorar a autenticação do usuário
            const unsubscribe = onAuthStateChanged(auth, async (user) => {

                unsubscribe();

                if (user) {

                    const credentials = JSON.parse(sessionStorage.getItem('credential') || 'null');

                    handleProviderLinking(user, data, credentials);
                }
            });
        } catch (error) {

            console.log(error);

            externalErrors = {
                ...externalErrors,
                ...handleFirebaseErrors(error)
            };

            const data = await registerMutation.mutateAsync({ ...formData });

            if (data.errors) {
                externalErrors = {
                    ...externalErrors,
                    ...handleBackendErrors(data.errors)
                };
            }
        } finally {
            setLoading(false); 
            setValidationErrors(externalErrors);
        }
    };

    const handleBackendErrors = (errorsArray) => {
        const errors = {};

        const errorMap = {
            "Username already exists": { username: "Username already taken" },
            "E-mail and Username already exists": { email: "Email already in use", username: "Username already taken" },
            "E-mail already exists": { email: "Email already in use" },
            "O nome de usuário deve ter pelo menos 5 caracteres.": { username: "Username must be at least 5 characters long." },
            "O nome de usuário deve ter no máximo 50 caracteres.": { username: "Username must be at most 50 characters long." },
            "O nome de usuário não deve conter espaços.": { username: "Username must not contain spaces." }
        };

        errorsArray.forEach(message => {
            const matchedError = Object.entries(errorMap).find(([key]) => message === key);
            if (matchedError) {
                Object.assign(errors, matchedError[1]);
            }
        });

        return errors;
    };

    const handleFirebaseErrors = (error) => {
        const errors = {};
        if (error.code === 'auth/email-already-in-use') {
            errors.email = "Email already in use";
        }
        return errors;
    };

    const handleProviderLinking = async (user, data, cred = null) => {
        const googleProvider = new GoogleAuthProvider();
        const facebookProvider = new FacebookAuthProvider();

        const googleProviderExists = user.providerData.some((provider) => provider.providerId === googleProvider.providerId);
        const facebookProviderExists = user.providerData.some((provider) => provider.providerId === facebookProvider.providerId);

        const unlinkPromises = [];

        if (googleProviderExists) {
            const googleCredential = GoogleAuthProvider.credential(cred.idToken);
            await reauthenticateWithCredential(user, googleCredential);
            unlinkPromises.push(unlink(user, googleProvider.providerId));
        }

        if (facebookProviderExists) {
            const facebookCredential = FacebookAuthProvider.credential(cred.accessToken);
            await reauthenticateWithCredential(user, facebookCredential);
            unlinkPromises.push(unlink(user, facebookProvider.providerId));
        }

        await Promise.all(unlinkPromises);

        const newUser = await signInWithCustomToken(auth, data.firebaseToken);

        const linkPromises = [];

        if (googleProviderExists) {
            const googleCredential = GoogleAuthProvider.credential(cred.idToken);
            linkPromises.push(linkWithCredential(newUser.user, googleCredential));
        }

        if (facebookProviderExists) {
            const facebookCredential = FacebookAuthProvider.credential(cred.accessToken);
            linkPromises.push(linkWithCredential(newUser.user, facebookCredential));
        }

        await Promise.all(linkPromises);

        await sendEmail({ email: newUser.user.email, uid: newUser.user.uid, oldEmail: data.oldUserEmail });

        await signOut(auth);

        navigate('/confirmEmail');

    };

    return { handleRegister };
}

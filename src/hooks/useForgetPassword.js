import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";


const useForgetPassword = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const mutation = useMutation({
        mutationFn: async (email) => {
            const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return response.text();
        }
    });

    return mutation;
};

// Hook para a requisição de reset de senha
const useResetPassword = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const location = useLocation(); // Para acessar os parâmetros da URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const mutation = useMutation({
        mutationFn: async ({ formData, setErrors, validationErrors }) => {

            // Se o token ou o step não estiverem presentes, lançar erro
            if (!token) {
                throw new Error("Invalid or missing token");
            }

            const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword: formData.password,
                    confirmNewPassword: formData.confirmPassword,
                    resetToken: token
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();

                // Verifica se o erro retornado é "This password is already being used by you"
                if (errorData === "This password is already being used by you") {
                    validationErrors.password = errorData;  // Adiciona a mensagem de erro ao objeto de erros
                    setErrors(validationErrors);  // Atualiza o estado de erros
                    throw new Error("Error");
                }
            }

            queryParams.set("step", "4"); // Altere o valor do step

            // Atualizar a URL sem recarregar a página
            window.history.replaceState(null, '', `${location.pathname}?${queryParams.toString()}`);

            // Disparar um evento popstate para que o React Router detecte a mudança
            window.dispatchEvent(new PopStateEvent('popstate'));

            return response.text();
        }
    });

    return mutation;
};

export { useForgetPassword, useResetPassword };
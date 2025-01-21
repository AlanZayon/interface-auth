// src/hooks/useSendEmail.js
import { useMutation } from "@tanstack/react-query";

export function useSendEmail() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sendEmailUser = async ({ email, uid, oldEmail }) => {
    const response = await fetch(`${API_BASE_URL}/user/SendEmailToVerify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ email, uid, oldEmail }), // `oldEmail` pode ser null
    });

    if (!response.ok) {
      throw new Error("Failed to send verification email");
    }

    return response.text();
  }

  const sendEmailMutation = useMutation({mutationFn: sendEmailUser},);

  return { sendEmail: sendEmailMutation.mutateAsync };
}

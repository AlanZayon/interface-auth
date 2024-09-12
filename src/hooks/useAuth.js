import { useEffect } from "react";
import { setPersistence, browserSessionPersistence, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from "../services/firebaseConfig";

export const useAuth = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {

        const user = auth.currentUser;
        if (user) {
          checkUserSession(user);
        }
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  }, [navigate]);

  const checkUserSession = async (user) => {
    const fireUserId = await user.getIdToken(true);
    const token = localStorage.getItem("token");
    const lastSignInTimeUTC = new Date(user.metadata.lastSignInTime);

    if ((new Date() - lastSignInTimeUTC) > (24 * 60 * 60 * 1000)) {
      await signOut(auth);
    } else if (fireUserId) {
      verificationTokenToPersistence(fireUserId, "Firebase");
    } else if (token) {
      verificationTokenToPersistence(token, "JWT");
    } else {
      navigate("/");
    }
  };

  const verificationTokenToPersistence = async (token, authType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "X-Auth-Type": authType
        }
      });
      if (!response.ok) {
        handleLogout(authType);
      } else {
        const data = await response.json();
        if (data.verified === false) {
          navigate("/confirmEmail")
        } else {
          navigate("/profile")
        }
      }
    } catch (error) {
      console.error("Error accessing protected resource:", error);
    }
  };

  const handleLogout = async (authType) => {
    localStorage.removeItem("token");
    if (authType === "Firebase") {
      await signOut(auth);
    }
    navigate("/");
  };
};

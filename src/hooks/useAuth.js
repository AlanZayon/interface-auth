import { useEffect } from "react";
import { setPersistence, browserLocalPersistence, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../components/context/LoadingContext';
import { auth } from "../services/firebaseConfig";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    setAuthPersistence();
  }, [navigate]);

  const setAuthPersistence = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const user = auth.currentUser;
        console.log(user);
        if (user) {
          handleFirebaseSession(user);
        } else {
          handleNativeSession();
        }
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  };

  const handleFirebaseSession = async (user) => {
    try {
      const fireUserId = await user.getIdToken(true);
      const lastSignInTimeUTC = new Date(user.metadata.lastSignInTime);

      if ((new Date() - lastSignInTimeUTC) > (24 * 60 * 60 * 1000)) {
        await signOut(auth);
        setLoading(false);
      } else {
        verificationTokenToPersistence(fireUserId, "Firebase");
      }
    } catch (error) {
      console.error("Error handling Firebase session:", error);
      await signOut(auth);
      setLoading(false);
      navigate("/");
    }
  };

  const handleNativeSession = () => {
    const token = localStorage.getItem("token");
    if (token) {
      verificationTokenToPersistence(token, "JWT");
    } else {
      setLoading(false);
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
        handleNavigation(data.verified);
      }
    } catch (error) {
      console.error("Error accessing protected resource:", error);
    }
  };

  const handleNavigation = (isVerified) => {
    if (!isVerified) {
      setLoading(false);
      navigate("/confirmEmail");
    } else {
      setLoading(false); 
      navigate("/profile");
    }
  };

  const handleLogout = async (authType) => {
    localStorage.removeItem("token");
    if (authType === "Firebase") {
      await signOut(auth);
    }
    setLoading(false); 
    navigate("/");
  };
};

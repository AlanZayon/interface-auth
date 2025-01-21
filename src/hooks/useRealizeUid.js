import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function useAuthState() {
  const [userUid, setUserUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setUserUid(idToken);
      } else {
        setUserUid(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { userUid, loading };
}

function useMainFunction() {
  const { userUid, loading } = useAuthState();

  return { userUid, loading };
}

export { useMainFunction };

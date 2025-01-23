import { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirect2AF, setRedirect2AF] = useState(false);


  return (
    <LoadingContext.Provider value={{ loading, setLoading, redirect, setRedirect, redirect2AF, setRedirect2AF }}>
      {children}
    </LoadingContext.Provider>
  );
};

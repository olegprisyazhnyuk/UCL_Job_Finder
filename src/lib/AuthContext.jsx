import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This site is a standalone public website, so there is no
  // authentication or Base44 backend.
  const isLoadingAuth = false;
  const isLoadingPublicSettings = false;
  const authError = null;
  const appPublicSettings = null;
  const authChecked = true;

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    // No login is required for this standalone website.
  };

  const checkUserAuth = async () => {
    // No authentication is used.
    return null;
  };

  const checkAppState = async () => {
    // No Base44 app state is used.
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
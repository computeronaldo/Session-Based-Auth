import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionID, setSessionID] = useState(null);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, sessionID, setSessionID }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;

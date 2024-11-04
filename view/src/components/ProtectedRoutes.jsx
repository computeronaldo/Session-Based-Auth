import { useContext, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const getProtectedResource = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/protected-resource",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
        }
        const data = await response.json();
        console.log(data);
        setIsAuthenticated(true);
      } catch (err) {
        console.log(err);
      }
    };

    getProtectedResource();
  }, []);

  console.log("Is this working", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;

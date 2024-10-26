import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { isAuthenticated, setIsAuthenticated, setSessionID, sessionID } =
    useContext(AuthContext);

  useEffect(() => {
    const getProtectedResource = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/protected-resource",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setData(data.message);
      } catch (err) {
        console.log(err);
      }
    };

    if (isAuthenticated && sessionID) {
      getProtectedResource();
    }
  }, [isAuthenticated, sessionID]);

  useEffect(() => {
    if (!isAuthenticated && !sessionID) {
      navigate("/login");
    }
  }, [isAuthenticated, sessionID]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data = await response.json();
      console.log(data);

      setIsAuthenticated(false);
      setSessionID(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <ProtectedText>{data}</ProtectedText>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  padding: 40px;
`;

const ProtectedText = styled.p`
  font-style: italic;
  color: green;
`;

const LogoutButton = styled.button`
  background-color: #afc1de;
  margin: 10px 0;
  cursor: pointer;
`;

export default Dashboard;

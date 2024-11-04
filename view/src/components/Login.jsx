import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import { useNavigate, NavLink } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLoginFormSubmission = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.log(response);
        if (response.status === 401) {
          throw new Error("Unauthorized request");
        }
      }
      const data = await response.json();
      if (data.message === "Logged in") {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <section>
      <LoginFormHeader>Login</LoginFormHeader>
      <LoginForm onSubmit={handleLoginFormSubmission}>
        <LoginFormItem>
          <label>Username:</label>
          <input
            onChange={(e) => handleInputChange(e)}
            name="username"
            value={username}
            type="text"
          />
        </LoginFormItem>
        <LoginFormItem>
          <label>Password</label>
          <input
            onChange={(e) => handleInputChange(e)}
            name="password"
            value={password}
            type="password"
          />
        </LoginFormItem>
        <SubmitButton type="submit">Submit</SubmitButton>
        <LinkItem>
          Don&apos;t have an account <NavLink to="/signup">Signup</NavLink>
        </LinkItem>
        {error && <Error>{error}</Error>}
      </LoginForm>
    </section>
  );
}

const LoginForm = styled.form`
  background-color: #4474c2;
  max-width: 350px;
  margin: 40px auto;
  padding: 16px;
  border-radius: 12px;
  color: white;
`;

const LoginFormHeader = styled.h2`
  font-size: 1.45rem;
  font-weight: bold;
  padding: 12px 0;
  text-align: center;
`;

const LoginFormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 12px 0;

  & > input {
    flex-grow: 1;
  }
`;

const SubmitButton = styled.button`
  display: block;
  margin: 5px auto;
  margin-bottom: 20px;
  padding: 5px 12px;
  background-color: #afc1de;
  border: 2px solid #2f353d;
  cursor: pointer;
`;

const LinkItem = styled.p`
  text-align: center;
`;

const Error = styled.p`
  color: white;
  padding-top: 20px;
  text-align: center;
`;

export default Login;

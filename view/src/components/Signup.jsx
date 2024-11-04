import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      navigate("/login");
    } catch (err) {
      console.log(err);
      setErrorMsg(err.message);
    }
  };

  return (
    <Wrapper>
      <Header>Signup</Header>
      <form onSubmit={handleSubmit}>
        <LoginFormItem>
          <label>Username:</label>
          <input
            name="username"
            value={username}
            onChange={(e) => handleInputChange(e)}
            type="text"
          />
        </LoginFormItem>
        <LoginFormItem>
          <label>Password:</label>
          <input
            name="password"
            value={password}
            onChange={(e) => handleInputChange(e)}
            type="password"
          />
        </LoginFormItem>
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
      {errorMsg && <ErrorBox>{errorMsg}</ErrorBox>}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  position: relative;
  max-width: 350px;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4474c2;
  padding: 16px;
  border-radius: 12px;
`;

const Header = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  margin: 16px 0;
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

const ErrorBox = styled.p`
  color: white;
`;

export default Signup;

import React, { useState } from "react";
import RegisterForm from "@/components/Registerform";
import LoginForm from "@/components/Loginform";
import styled from "styled-components";

const LoginRegisterComp = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  return (
    <>
      <LoginRegisterContainer>
        <LoginRegisterBtn onClick={toggleForm}>
          {showLogin ? "Register Here" : "Let me Login"}
        </LoginRegisterBtn>
        {showLogin ? (
          <LoginForm />
        ) : (
          <RegisterForm
            isLoggedIn={false}
            setIsLoggedIn={(isLoggedIn: boolean) => {}}
            setUserName={(name: string) => {}}
          />
        )}
      </LoginRegisterContainer>
    </>
  );
};

const LoginRegisterBtn = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border-color: #f3d8b6;
  background-color: transparent;
  color: #f3d8b6;
  cursor: pointer;
`;
const LoginRegisterContainer = styled.div`
  background-color: #f3d8b6;
  padding-top: 1%;
  height: 400px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 10%;
  background-color: rgb(245, 114, 101, 0.8);

  @media screen and (max-width: 768px) {
    background-color: #f64b45cd;
    font-weight: 700;
    margin-bottom: 50px;
  }
`;

export default LoginRegisterComp;

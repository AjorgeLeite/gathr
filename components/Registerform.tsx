import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

type RegisterTypes = {
  isLoggedIn: boolean;
  setIsLoggedIn: 
};

const RegisterForm: React.FC<RegisterTypes> = ({ isLoggedIn, setIsLoggedIn }, setUserName) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitRequest, setSubmitRequest] = useState({
    isLoading: false,
    submitted: false,
    error: false,
  });

  const onRegisterSubmit = async (e) => {
    try {
      e.preventDefault(); // Prevenir carregar na mesma pagina ( form )
      setSubmitRequest({ isLoading: true });
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:SGjuPeF3/auth/signup",
        { email, password, name }
      );
      setSubmitRequest({ error: false, submitted: true });
      console.log("Register");
      setUserName(name);
      setIsLoggedIn(true);
    } catch (error) {
      setSubmitRequest({
        error: true,
        submitted: true,
        isLoading: false,
        errorMessage: error.response.data.message,
      });
      console.log("Error: " + error);
    }
  };
  
  return (
    <>
      <h2>Please Register Here: </h2>
      <FormStyle onSubmit={onRegisterSubmit}>
        <TextInputs
          required
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextInputs
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextInputs
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <SubmitBtn>Register</SubmitBtn>
        {submitRequest.error && <p>{submitRequest.errorMessage}</p>}
        {!submitRequest.error && submitRequest.submitted && (
          <p>Account Created</p>
        )}
        {submitRequest.isLoading && <img src="../assets/infinity.svg" />}
      </FormStyle>
    </>
  );
};

const FormStyle = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const TextInputs = styled.input`
  background-color: black;
  color: white;
  border-radius: 20px;
  padding: 10px;
  border-color: #9b083b;
`;

const SubmitBtn = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 20px;
  border-color: red;
`;

export default RegisterForm;

import React, { useState, FC } from "react";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";

type RegisterTypes = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserName: (name: string) => void;
};

const RegisterForm: FC<RegisterTypes> = ({ isLoggedIn, setIsLoggedIn, setUserName }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitRequest, setSubmitRequest] = useState({
    isLoading: false,
    submitted: false,
    error: false,
    errorMessage: "",
  });

  const onRegisterSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setSubmitRequest({ isLoading: true, submitted: false, error: false, errorMessage: "" });
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/signup",
        { email, password, name }
      );
      setSubmitRequest({ error: false, submitted: true, isLoading: false, errorMessage: "" });
      console.log("Register");
      setUserName(name);
      setIsLoggedIn(true);
    } catch (error:any) {
      setSubmitRequest({
        error: true,
        submitted: true,
        isLoading: false,
        errorMessage: error.response.data.message,
      });
      console.error("Error: " + error);
    }
  };

  return (
    <>
    <FormContainer>
      <h2>Please Register Here: </h2>
      <FormStyle onSubmit={onRegisterSubmit}>
        <TextInputs
        className="txtinput"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextInputs
        className="txtinput"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextInputs
        className="txtinput"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <SubmitBtn type="submit">Register</SubmitBtn>
        {submitRequest.error && <p>{submitRequest.errorMessage}</p>}
        {!submitRequest.error && submitRequest.submitted && <p>Account Created</p>}
        {submitRequest.isLoading && <Image src="/assets/loading1s.gif" width={50} height={50} alt="Loading" />}
      </FormStyle>
      </FormContainer>
    </>
  );
};

const FormContainer = styled.div`
gap: 20px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
min-height: 300px;
`;
const FormStyle = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const TextInputs = styled.input`
  background-color: transparent;
  color: white;
  border-radius: 10px;
  padding: 10px;
  border-color: #f3d8b6;
`;

const SubmitBtn = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border-color: #f3d8b6;
  background-color: transparent;
  color: #f3d8b6;
  cursor: pointer;
`;

export default RegisterForm;

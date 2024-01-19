import React, { useState, FC } from "react";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../store/action-creators/actions";
import { setCookie, parseCookies } from "nookies";

type RegisterTypes = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserName: (name: string) => void;
};

const RegisterForm: FC<RegisterTypes> = ({ setIsLoggedIn, setUserName }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitRequest, setSubmitRequest] = useState({
    isLoading: false,
    submitted: false,
    error: false,
    errorMessage: "",
  });

  const router = useRouter();

  const onRegisterSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setSubmitRequest({
        isLoading: true,
        submitted: false,
        error: false,
        errorMessage: "",
      });
      
      await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/signup",
        { email, password, name }
      );

      const loginResponse = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/login",
        { email, password }
      );

      dispatch(loginSuccess(loginResponse.data.user.name, loginResponse.data.user.id));
      setUserName(loginResponse.data.user.name);
      setIsLoggedIn(true);

      setCookie(null, "authToken", loginResponse.data.authToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      setSubmitRequest({
        error: false,
        submitted: true,
        isLoading: false,
        errorMessage: "",
      });

      router.push("/events");
    } catch (error: any) {
      let updatedErrorMessage =
        error?.response?.data?.message || "An error occurred";

      if (
        updatedErrorMessage ===
        "Input does not meet minimum length requirement of 8 characters"
      ) {
        updatedErrorMessage =
          "Password minimum length requirement of 8 characters";
      }

      setSubmitRequest({
        error: true,
        submitted: true,
        isLoading: false,
        errorMessage: updatedErrorMessage,
      });
    }
  };

  return (
    <>
      <FormContainer>
        <TextColor>Please Register Here: </TextColor>
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
          <ErrorMsg>
            {submitRequest.error && <p>{submitRequest.errorMessage}</p>}
          </ErrorMsg>
          {!submitRequest.error && submitRequest.submitted && (
            <p>Account Created</p>
          )}
          {submitRequest.isLoading && (
            <Image
              src="/assets/loading1s.gif"
              width={50}
              height={50}
              alt="Loading"
            />
          )}
        </FormStyle>
      </FormContainer>
    </>
  );
};

const ErrorMsg = styled.div`
  width: 95%;
  text-align: center;
  margin-bottom: 4%;
`;

const TextColor = styled.h2`
  color: #f3d8b6;
`;

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

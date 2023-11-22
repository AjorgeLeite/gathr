import { useState, FormEvent } from "react";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onLoginSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/login",
        { email, password }
      );

      localStorage.setItem("authToken", response.data.authToken);
      setSubmitted(true);
      setIsLoggedIn(true);
    } catch (error: any) {
      setError(true);
      setSubmitted(true);
      setIsLoading(false);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <FormContainer>
        <h2>Please Login Here: </h2>
        <FormStyle onSubmit={onLoginSubmit}>
          <TextInputs
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInputs
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitBtn>Login</SubmitBtn>
          {error && <p>{errorMessage}</p>}
          {!error && submitted && <p>Logged In</p>}
          {isLoading && (
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

const TextInputs = styled.input<{ className?: string }>`
  background-color: transparent;
  color: white;
  border-radius: 10px;
  padding: 10px;
  border-color: #f3d8b6;
  ::placeholder {
    color: #f3d8b6;
  }
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

export default LoginForm;

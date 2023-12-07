import { useState, FormEvent } from "react";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../store/action-creators/actions';
import { useRouter } from "next/router";
import { setCookie, parseCookies } from 'nookies';


interface LoginFormProps {}

interface RootState {
  user: {
    isLoggedIn: boolean;
    name: string;
    userId: number | null;
  };
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLoginSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const response = await axios.post(
        'https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/login',
        { email, password }
      );

      setCookie(null, 'authToken', response.data.authToken, {
        maxAge: 30 * 24 * 60 * 60, 
        path: '/',
      });

      const userInfo = await axios.get(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/me",
        { headers: { Authorization: "Bearer " + response.data.authToken } }
      );

      dispatch(loginSuccess(userInfo.data.name, userInfo.data.id));

     console.log(
        "userid: " + userInfo.data.id,
        "usernames: " + userInfo.data.name,
      );
      router.push('/events');
    } catch (error: any) {
      dispatch(loginFailure(error.response.data.message));
      setError(true);
      setSubmitted(true);
      setIsLoading(false);
      setErrorMessage(error.response.data.message);
    }
  };
  return (
    <>
      <FormContainer>
        <TextColor>Please Login Here: </TextColor>
        <FormStyle onSubmit={onLoginSubmit}>
          <TextInputs
          className="txtinput"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInputs
          className="txtinput"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitBtn>Login</SubmitBtn>
          {error && <p>{errorMessage}</p>}
          {!error && submitted && <p>Logged In</p>}
          {isLoading && <Image src="/assets/loading1s.gif" width={50} height={50} alt="Loading" />}
        </FormStyle>
      </FormContainer>
    </>
  );
};

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
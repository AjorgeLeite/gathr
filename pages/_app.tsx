import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../store/store";
import { loginSuccess } from "@/store/action-creators/actions";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import axios from "axios";
import React from "react";
import styled from "styled-components";
import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);

  useEffect(() => {
    async function checkAuthToken() {
      const { authToken } = parseCookies();

      if (authToken) {
        try {
          const userInfo = await axios.get(
            "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/me",
            { headers: { Authorization: "Bearer " + authToken } }
          );

          store.dispatch(loginSuccess(userInfo.data.name, userInfo.data.id));
          setIsUserInfoLoaded(true);
        } catch (error) {
          console.error("Error fetching user information:", error);
          setIsUserInfoLoaded(true);
        }
      } else {
        setIsUserInfoLoaded(true);
      }
    }

    checkAuthToken();
  }, []);

  if (!isUserInfoLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Provider store={store}>
        <Head>
          <title>gathr</title>
          <meta name="description" content="Welcome to gathr" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/assets/favicon.png" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
}

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <StyledImage
        src={"/assets/loading1.5s.gif"}
        alt={"About"}
        width={1000}
        height={600}
      ></StyledImage>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  background-color: #f3d8b6;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const StyledImage = styled(Image)`
  width: 20vw;
  height: 40vh;
`;

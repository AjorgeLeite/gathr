import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../store/store";
import { loginSuccess } from "@/store/action-creators/actions";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import axios from "axios";


export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    async function checkAuthToken() {
      const { authToken } = parseCookies();

      if (authToken) {
        try {
          const userInfo = await axios.get(
            'https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/auth/me',
            { headers: { Authorization: 'Bearer ' + authToken } }
          );

          store.dispatch(loginSuccess(userInfo.data.name, userInfo.data.id));
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      }
    }

    checkAuthToken();
  }, []);


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

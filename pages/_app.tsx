import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { Provider } from'react-redux';
import store from '../store/store';



export default function App({ Component, pageProps }: AppProps) {
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
  )
}

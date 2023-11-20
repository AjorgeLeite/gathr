import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    <Head>
    <title>gathr</title>
    <meta name="description" content="Welcome to gathr" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/assets/favicon.png" />
  </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  )
}

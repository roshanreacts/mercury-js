import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { worker } from '../specs/mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to core-ui!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;

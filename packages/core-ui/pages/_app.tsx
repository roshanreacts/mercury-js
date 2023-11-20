import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@emotion/react';
import { Provider } from 'mobx-react';
import theme from '../components/theme';
import './styles.css';
import { initMocks } from '../specs/mocks/server';
import { useStore } from '../store';

if (process.env.NODE_ENV === 'development') {
  initMocks();
}

function CustomApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialState);
  return (
    <>
      <Head>
        <title>Welcome to core-ui!</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <main className="app">
            <Component {...pageProps} />
          </main>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default CustomApp;

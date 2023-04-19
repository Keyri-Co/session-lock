import Head from 'next/head';
import AuthForm from '../components/AuthForm';

export default function Auth() {
  return (
    <>
      <Head>
        <title>session-lock - Auth Demo</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='The demo authentication page for session-lock.'
        />
      </Head>
      <AuthForm />
    </>
  );
}

import { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { UserContext } from '@/pages/_app';
import { lockToken, clearIdb } from 'session-lock';
import CopyTokenButton from '@/components/CopyTokenButton';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) {
        Router.push('/auth');
      }

      try {
        const lockedToken = await lockToken(token);

        const res = await fetch('/api/protected', {
          headers: { Authorization: `Bearer ${lockedToken}` },
        });

        if (res.status === 200) {
          const data = await res.json();

          setIsLoggedIn(true);
          setMessage(data.message);
        } else {
          setIsLoggedIn(false);
          setMessage(data.message);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
        setMessage(
          `Looks like you don't have the correct private key in your browser's IndexedDB. Try breaking this again or give up and log in legitimately 🙃`
        );
      }
    }

    fetchData();
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearIdb();
    setIsLoggedIn(false);
    Router.push('/auth');
  };

  return (
    <>
      <Head>
        <title>session-lock - Dashboard</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='The post-authentication page for session-lock demo.'
        />
      </Head>
      <div className='container'>
        <h1 className='text-2xl font-bold mb-4'>
          {isLoggedIn ? `You're logged in!` : `Try again!`}
        </h1>
        <div className='container mx-auto mb-4'>
          <p>{message}</p>
        </div>
        {isLoggedIn ? (
          <>
            <CopyTokenButton />
            <button
              className='bg-[#934D91] hover:bg-[#A0549D]  text-white font-medium rounded-lg text-m px-4 py-2 mx-4 text-center'
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              className='bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg text-m px-4 py-2 text-center'
              onClick={handleLogout}
            >
              Go back
            </button>
          </>
        )}
      </div>
    </>
  );
}

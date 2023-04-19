import { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import { UserContext } from '@/pages/_app';
import { lockToken, clearIdb } from '@/lib/session-lock';
import SignalBoxes from '@/components/SignalBoxes';
import CopyTokenButton from '@/components/CopyTokenButton';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const [signals, setSignals] = useState([]);

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
          `Looks like you don't have a private key in your browser's IndexedDB. Try breaking this again or give up and log in legitimately 🙃`
        );
      }
    }

    fetchData();
    const storedSignals = localStorage.getItem('signals');
    if (storedSignals) {
      setSignals(storedSignals.split(','));
    }
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('eventDetails');
    clearIdb();
    setIsLoggedIn(false);
    Router.push('/auth');
  };

  return (
    <>
      <div className='container'>
        <h1 className='text-2xl font-bold mb-4'>{isLoggedIn ? `You're logged in!` : `Try again!`}</h1>
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

        <div className='container mx-auto max-w-screen-xl mt-20'>
          <p className='text-m mb-2 border-b border-gray-600'>Risk Signals</p>

          <SignalBoxes signals={signals} />
        </div>
      </div>
    </>
  );
}

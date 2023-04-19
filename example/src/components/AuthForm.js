import { useState, useContext } from 'react';
import Router from 'next/router';
import { UserContext } from '@/pages/_app';
import { generateKeyPair } from 'session-lock';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [jwtInput, setJwtInput] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  const toggleAuthState = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    
    const publicKey = await generateKeyPair();
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, publicKey }),
    });

    if (res.status === 200) {
      toggleAuthState();
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setLoading(false);
      Router.push('/dashboard');
    } else {
      setLoading(false);
      alert('Failed to sign up');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const publicKey = await generateKeyPair();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, publicKey }),
    });

    if (res.status === 200) {
      toggleAuthState();
      setLoginError('');
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setLoading(false);
      Router.push('/dashboard');
    } else {
      setLoading(false);
      setLoginError('Invalid username or password');
      await device.generateEvent({ eventType: 'login', eventResult: 'fail', userId: username });
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleJwtAuth = (e) => {
    e.preventDefault();
    localStorage.setItem('token', jwtInput);
    Router.push('/dashboard');
  };

  return (
    <div className='w-full'>
      <div className='flex flex-col mb-4'>
        <h1 className='w-full max-w-sm mx-auto text-2xl font-bold'>{isLogin ? 'Log in' : 'Register'}</h1>
      </div>
      <form className='w-full max-w-sm mx-auto' onSubmit={isLogin ? handleLogin : handleSignup}>
        <div className='flex flex-col mb-4'>
          <input
            className='py-2 px-3 border rounded placeholder-gray-500 focus:outline-none text-gray-800'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col mb-4'>
          <input
            className='py-2 px-3 border rounded placeholder-gray-500 focus:outline-none text-gray-800'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col mb-4'>
          <button
            className='bg-[#934D91] hover:bg-[#A0549D] text-white font-bold py-2 px-4 rounded focus:outline-none flex items-center justify-center'
            type='submit'
            disabled={loading}
          >
            {loading ? (
              <div className='animate-spin w-4 h-4 border-t-2 border-white rounded-full' />
            ) : isLogin ? (
              'Log in'
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>
      <div className='flex flex-col mb-4'>
        {loginError && <p className='text-red-500 w-full max-w-sm mx-auto'>{loginError}</p>}
        <p className='w-full max-w-sm mx-auto hover:text-[#A0549D] hover:cursor-pointer' onClick={toggleAuthMode}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
        </p>
      </div>

      <div className='flex flex-col mb-4 w-full max-w-sm mx-auto'>
        <h3 className='text-lg font-semibold mb-4 border-t border-gray-600 py-4'>
          Or authenticate with JWT from other session
        </h3>
        <input
          className='py-2 px-3 border rounded placeholder-gray-500 focus:outline-none text-gray-800 mb-4'
          type='text'
          placeholder='Paste your JWT here'
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
        />
        <button
          className='bg-indigo-800 border border-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none flex items-center justify-center'
          onClick={handleJwtAuth}
          disabled={loading || !jwtInput}
        >
          Authenticate with JWT
        </button>
      </div>
    </div>
  );
};

export default AuthForm;

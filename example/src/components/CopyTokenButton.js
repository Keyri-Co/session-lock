import { useState, useEffect } from 'react';

function CopyTokenButton() {
  const [buttonText, setButtonText] = useState('Copy JWT to clipboard');

  useEffect(() => {
    let timeoutId;
    if (buttonText === 'Copied!') {
      timeoutId = setTimeout(() => {
        setButtonText('Copy JWT to clipboard');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [buttonText]);

  const copyTokenToClipboard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await navigator.clipboard.writeText(token);
        setButtonText('Copied!');
      }
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  return (
    <button
      onClick={copyTokenToClipboard}
      className='bg-[#5A8958] hover:bg-[#61955F] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline'
    >
      {buttonText}
    </button>
  );
}

export default CopyTokenButton;

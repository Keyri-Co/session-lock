import { useState, useEffect } from 'react';

function UpdatedAtText() {
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchLastUpdated() {
      try {
        const response = await fetch('https://api.github.com/repos/Keyri-Co/session-lock-example');
        const data = await response.json();
        setLastUpdated(data.pushed_at);
      } catch (error) {
        console.error('Error fetching last updated date:', error);
      }
    }

    fetchLastUpdated();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return <>{lastUpdated && <p className='text-gray-400 self-center'>Updated {formatDate(lastUpdated)}</p>}</>;
}

export default UpdatedAtText;

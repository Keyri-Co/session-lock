import React from 'react';

const SignalBoxes = ({ signals }) => {
  return (
    <div className='flex flex-row space-x-4'>
      {signals.map((signal, index) => (
        <div key={index} className='bg-[#C42021] text-white p-2 rounded-md'>
          {signal}
        </div>
      ))}
    </div>
  );
};

export default SignalBoxes;

import Link from 'next/link';
import Image from 'next/image';
import UpdatedAtText from './UpdatedAtText';

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <nav className='w-full border-b border-gray-600'>
        <div className='container mx-auto max-w-screen-xl flex justify-between items-center px-8 py-2'>
          <Link href='/' className='text-white text-3xl font-semibold'>
            Session Lock
          </Link>
          <Link href='/dashboard'>
            <button
              type='button'
              className='bg-[#934D91] hover:bg-[#A0549D] text-white font-medium rounded-lg text-m px-4 py-2 m-3'
            >
              Demo
            </button>
          </Link>
        </div>
      </nav>

      <main className='container mx-auto max-w-screen-xl px-8 py-4 text-white flex-grow'>{children}</main>

      <footer className='w-full z-20'>
        <div className='container mx-auto max-w-screen-xl flex justify-between items-center px-8 py-2'>
          <a target='_blank' href='https://keyri.com' className='flex items-center'>
            <Image src='/keyri-logo-negative.svg' alt='Keyri Logo' width={90} height={40} className='ml-5 mt-3 mb-3' />
          </a>
          <div className='flex items-center'>
            <a
              href='https://github.com/Keyri-Co/session-lock-example'
              target='_blank'
              rel='noopener noreferrer'
              className='mr-4'
            >
              <Image src='/github.svg' alt='GitHub Icon' width={24} height={24} />
            </a>
            <UpdatedAtText />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const markdown = `\`session-lock\` is a token binding scheme and JS library that significantly mitigates the risk of session hijacking / token replay attacks by binding a user's JWT to their browser or device.

Today, the library can be used with any JWT-based authorization system in which you control the JWT generation and verification. The general binding scheme can be used with JWT and cookie-based authorization systems alike, though the library currently only supports JWT-based systems due to the varied ways in which stateful session data is stored server side.

# Background

As authentication methods become stronger and better MFA is implemented, session tokens become the weak link in the chain. If an attacker can steal a user's session token, they can access protected resources belonging to the user much like they would if they had access to the user's authentication credentials. With the use of OS-level malware, malicious browser extensions, or traffic sniffing, an attacker can steal users' session tokens directly from their browsers or from the network, then use those tokens to authorize their own sessions.

Here's a visualization of how session hijacking works. In this example, we're stealing JWTs from a legitimate session out of Local Storage and replaying them in a separate unauthenticated session.

**TODO: Add gif of session hijacking attack - use ipdata**`;

export default function Home() {
  return (
    <>
      <div className='prose prose-invert max-w-none prose-headings:border-b prose-headings:border-gray-600 prose-h1:text-2xl'>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      <p>
        <Link href='/auth'>Click here to sign in or sign up.</Link>
      </p>
    </>
  );
}

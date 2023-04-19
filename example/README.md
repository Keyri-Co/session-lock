This is a [Next.js](https://nextjs.org/) project that demonstrates how session-lock works and can be implemented. Specific files to note are:
- `/src/components/AuthForm.js` - The login form component that generates a key pair and sends the public key to the server when an authentication request is made. 
- `/src/pages/dashboard.js` - The dashboard page that makes a protected resource request to the server. Also contains a logout button that, in addition to removing the JWT, clears the IndexedDB database.
- `/src/pages/api/login.js` - A login API endpoint that embeds the public key into the JWT it returns to the client if the login request is otherwise valid (i.e., the username+password credential is correct).
- `/src/pages/api/protected.js` - A protected resource API endpoint that verifies the JWT's signature and timestamp before returning the protected resource.

## Running locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
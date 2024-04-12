import { verify } from '@/lib/jwt';
import { verifyLockedToken, splitLockedToken } from 'session-lock';

export default async function protectedRoute(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenValidation = await verifyLockedToken(token);

    if (tokenValidation !== 'valid') {
      return res.status(401).json({ error: tokenValidation });
    }

    const jwt = splitLockedToken(token).jwt;
    const decoded = verify(jwt);
    res.status(200).json({
      message: `Hello, ${decoded.username}! You successfully authenticated using a token that was genuinely issued to your browser. Try copying the JWT from this session into an unauthenticated session on this or another browser. \n The green button below will pull the JWT from this session's LocalStorage and copy it to your clipboard. On the preceding auth page, you can paste it into the JWT input, which will put the same JWT back into the LocalStorage, and try to log in.`,
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

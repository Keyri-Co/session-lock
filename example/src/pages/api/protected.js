import { verify } from '@/lib/jwt';
import { verifyLockedToken, splitLockedToken } from '@/lib/session-lock';

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
      message: `Hello, ${decoded.username}! You successfully authenticated using a token that was genuinely issued to your browser. Try copying the JWT from this session into an unauthenticated session on another browser`,
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

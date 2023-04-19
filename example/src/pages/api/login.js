import bcrypt from 'bcryptjs';
import { query } from '../../../database';
import { sign } from '../../lib/jwt';

export default async function login(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, publicKey } = req.body;

  try {
    const users = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).end();
    }

    const token = sign({ id: user.id, username: user.username, publicKey: publicKey });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
}

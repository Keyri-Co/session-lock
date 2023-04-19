import bcrypt from 'bcryptjs';
import { query } from '../../../database';
import { sign } from '../../lib/jwt';

export default async function signup(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, publicKey } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    const users = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user = users[0];
    const token = sign({ id: user.id, username: user.username, publicKey: publicKey });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
    console.log(error);
  }
}

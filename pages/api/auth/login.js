import { connectToDatabase } from '../../../utils/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })

  const { db } = await connectToDatabase()
  const user = await db.collection('users').findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  return res.status(200).json({ token })
}

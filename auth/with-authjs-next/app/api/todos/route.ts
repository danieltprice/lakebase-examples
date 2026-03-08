import { auth } from '@/auth'
import { pool } from '@/lib/lakebase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { content } = await req.json()
  try {
    const { rows } = await pool.query('INSERT INTO todos (user_id, content) VALUES ($1, $2) RETURNING *', [session.user.id, content])
    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}

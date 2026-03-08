import PostgresAdapter from '@auth/pg-adapter'
import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { pool } from '@/lib/lakebase'

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  return {
    adapter: PostgresAdapter(pool),
    providers: [Resend({ from: 'Test <onboarding@resend.dev>' })],
  }
})

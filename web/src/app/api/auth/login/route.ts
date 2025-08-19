import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'

const schema = z.object({ email: z.string().email(), password: z.string().min(1) })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = schema.parse(body)

    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await comparePassword(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ userId: user.id, email: user.email })
    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



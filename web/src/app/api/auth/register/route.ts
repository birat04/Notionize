import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

const schema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password } = schema.parse(body)

    const existing = await prisma.users.findFirst({ where: { OR: [{ email }, { username }] } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashed = await hashPassword(password)
    const user = await prisma.users.create({
      data: { username, email, password: hashed },
      select: { id: true, username: true, email: true, created_at: true },
    })

    const token = signToken({ userId: user.id, email: user.email })
    return NextResponse.json({ user, token }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



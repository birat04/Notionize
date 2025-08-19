import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getTokenFromHeader(request: Request): string | null {
  const auth = request.headers.get('authorization')
  if (!auth) return null
  const [, token] = auth.split(' ')
  return token || null
}

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request)
    if (!token) return NextResponse.json({ error: 'Access token required' }, { status: 401 })
    const payload = verifyToken(token)

    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, age: true, created_at: true, addresses: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }
}



import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const createSchema = z.object({ title: z.string().min(1).max(255), description: z.string().optional() })
const updateSchema = z.object({ title: z.string().optional(), description: z.string().optional(), completed: z.boolean().optional() })

function getUserId(request: Request): number {
  const auth = request.headers.get('authorization')
  if (!auth) throw new Error('Unauthorized')
  const [, token] = auth.split(' ')
  const payload = verifyToken(token)
  return payload.userId
}

export async function GET(request: Request) {
  try {
    const userId = getUserId(request)
    const todos = await prisma.todo.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } })
    return NextResponse.json({ todos })
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request)
    const body = await request.json()
    const { title, description } = createSchema.parse(body)
    const todo = await prisma.todo.create({ data: { title, description, user_id: userId } })
    return NextResponse.json({ todo }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation error', issues: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}



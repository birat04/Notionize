import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const updateSchema = z.object({ title: z.string().optional(), description: z.string().optional(), completed: z.boolean().optional() })

function getUserId(request: Request): number {
  const auth = request.headers.get('authorization')
  if (!auth) throw new Error('Unauthorized')
  const [, token] = auth.split(' ')
  const payload = verifyToken(token)
  return payload.userId
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request)
    const id = Number(params.id)
    const body = await request.json()
    const data = updateSchema.parse(body)

    const existing = await prisma.todo.findFirst({ where: { id, user_id: userId } })
    if (!existing) return NextResponse.json({ error: 'Todo not found' }, { status: 404 })

    const todo = await prisma.todo.update({ where: { id }, data })
    return NextResponse.json({ todo })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation error', issues: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request)
    const id = Number(params.id)
    const existing = await prisma.todo.findFirst({ where: { id, user_id: userId } })
    if (!existing) return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    await prisma.todo.delete({ where: { id } })
    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}



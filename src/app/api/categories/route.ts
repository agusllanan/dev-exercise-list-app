import { createCategory } from '@/lib/models/category'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const schema = z.object({
      name: z.string().trim().min(1),
      description: z.string().trim().optional(),
    })

    const data = schema.parse(body)
    const category = await createCategory(data.name, data.description)
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle other errors
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

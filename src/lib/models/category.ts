import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import prisma from '../prisma'

type Category = {
  id: string
  name: string
  description: string | null
}

export const createCategory = async (name: string, description?: string): Promise<Category> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
  })

  const parse = schema.safeParse({ name, description })

  if (!parse.success) {
    throw fromError(parse.error)
  }

  const data = parse.data
  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
    },
  })

  return {
    id: category.id,
    name: category.name,
    description: category.description,
  }
}

export const listCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
  }))
}

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const category = await prisma.category.findUnique({ where: { id } })
  return category
    ? {
        id: category.id,
        name: category.name,
        description: category.description,
      }
    : null
}

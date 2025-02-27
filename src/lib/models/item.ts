import { del } from '@vercel/blob'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import prisma from '../prisma'
import { AuthUser } from './user'

type ListItem = {
  id: string
  name: string
  photoUrl: string | null
}

type ListItemDetails = {
  id: string
  name: string
  description: string | null
  photoUrl: string | null
}

export const listMyItems = async (authUser: AuthUser): Promise<ListItem[]> => {
  const items = await prisma.listItem.findMany({ where: { authorId: authUser.id } })
  return items.map((item) => ({ id: item.id, name: item.name, photoUrl: item.photoUrl }))
}

export const getItemDetails = async (
  authUser: AuthUser,
  id: string,
): Promise<ListItemDetails | null> => {
  const listItem = await prisma.listItem.findFirst({ where: { id, authorId: authUser.id } })
  if (!listItem) return null
  return {
    id: listItem.id,
    name: listItem.name,
    description: listItem.description,
    photoUrl: listItem.photoUrl,
  }
}

export const createItem = async (
  authUser: AuthUser,
  name: string,
  description: string,
  photoUrl: string | null,
): Promise<ListItem> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
    photoUrl: z.string().trim().url().optional(),
  })

  const parse = schema.safeParse({ name, description, photoUrl })

  if (!parse.success) {
    throw fromError(parse.error)
  }

  const data = parse.data
  const listItem = await prisma.listItem.create({
    data: {
      name: data.name,
      description: data.description,
      photoUrl: data.photoUrl,
      authorId: authUser.id,
    },
  })
  return { id: listItem.id, name: listItem.name, photoUrl: listItem.photoUrl }
}

export const deleteItem = async (authUser: AuthUser, id: string): Promise<void> => {
  const item = await prisma.listItem.findFirst({ where: { id, authorId: authUser.id } })

  if (item && item.photoUrl) {
    try {
      const url = new URL(item.photoUrl)
      const pathname = url.pathname
      await del(pathname)
    } catch (error) {
      console.error('Error deleting blob:', error)
    }
  }

  await prisma.listItem.delete({ where: { id, authorId: authUser.id } })
}

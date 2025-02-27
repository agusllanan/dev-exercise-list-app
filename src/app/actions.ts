'use server'

import { createItem, deleteItem } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export const addItemAction = async (formData: FormData): Promise<void> => {
  const authUser = getCurrentAuthUser()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const photoUrl = formData.get('photoUrl') as string
  const photoUrlValue = photoUrl && photoUrl.trim() !== '' ? photoUrl : null
  const categoryId = formData.get('categoryId') as string
  await createItem(authUser, name, description, photoUrlValue, categoryId)
  revalidatePath('/')
}

export const deleteItemAction = async (id: string): Promise<void> => {
  const authUser = getCurrentAuthUser()
  await deleteItem(authUser, id)
  revalidatePath('/')
}

export const uploadPhotoAction = async (formData: FormData): Promise<{ url: string } | null> => {
  const file = formData.get('file') as File

  // Check if file exists and is an image
  if (!file || !file.type.startsWith('image/')) {
    return null
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      contentType: file.type,
    })

    return { url: blob.url }
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

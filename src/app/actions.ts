'use server'

import { createItem, deleteItem } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import { revalidatePath } from 'next/cache'

export const addItemAction = async (formData: FormData): Promise<void> => {
  const authUser = getCurrentAuthUser()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const photoUrl = formData.get('photoUrl') as string
  const photoUrlValue = photoUrl && photoUrl.trim() !== '' ? photoUrl : null
  await createItem(authUser, name, description, photoUrlValue)
  revalidatePath('/')
}

export const deleteItemAction = async (id: string): Promise<void> => {
  const authUser = getCurrentAuthUser()
  await deleteItem(authUser, id)
  revalidatePath('/')
}

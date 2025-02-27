'use client'

import { deleteItemAction } from '@/app/actions'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'

export const DeleteItemButton = ({ id }: { id: string }) => {
  return (
    <IconButton edge="end" aria-label="delete" onClick={() => deleteItemAction(id)}>
      <DeleteIcon color="error" />
    </IconButton>
  )
}

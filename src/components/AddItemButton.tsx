'use client'

import { addItemAction, uploadPhotoAction } from '@/app/actions'
import { formatErrorMessage } from '@/lib/utils'
import { Add, CloudUpload } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useSnackbar } from 'notistack'
import { useRef, useState } from 'react'

export const AddItemButton = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file', { variant: 'error' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size should be less than 5MB', { variant: 'error' })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadPhotoAction(formData)

      if (result) {
        setPhotoUrl(result.url)
      } else {
        enqueueSnackbar('Failed to upload image', { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(formatErrorMessage(error), { variant: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      if (photoUrl) {
        formData.append('photoUrl', photoUrl)
      }

      await addItemAction(formData)
    } catch (error) {
      enqueueSnackbar(formatErrorMessage(error), { variant: 'error' })
      return
    }

    handleClose()
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" startIcon={<Add />}>
        Add item
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
        <form action={handleSubmit}>
          <DialogTitle>Add an item to the list</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ my: 2 }}>
              <TextField name="name" label="Name" fullWidth />
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline={true}
                rows={4}
              />

              {/* Photo upload section */}
              <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {photoUrl ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Image
                      src={photoUrl}
                      alt="Preview"
                      width={200}
                      height={200}
                      style={{ objectFit: 'contain', maxHeight: '200px' }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => setPhotoUrl(null)}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Supported formats: JPG, PNG, GIF (max 5MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={uploading}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

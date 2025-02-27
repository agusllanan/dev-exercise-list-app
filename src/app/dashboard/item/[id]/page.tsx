import { getItemDetails } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Paper, Typography } from '@mui/material'
import Image from 'next/image'

export default async function Page({ params }: { params: { id: string } }) {
  const authUser = getCurrentAuthUser()
  const itemDetails = await getItemDetails(authUser, params.id)

  return (
    <Box>
      <Button href={'/dashboard'} startIcon={<ArrowBackIcon />}>
        Back to all items
      </Button>
      {itemDetails ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4">{itemDetails.name}</Typography>
          <Typography color={itemDetails.description ? 'text.primary' : 'text.secondary'}>
            {itemDetails.description || 'No description'}
          </Typography>
          {itemDetails.photoUrl ? (
            <Paper elevation={2} sx={{ p: 2, maxWidth: 500 }}>
              <Image
                src={itemDetails.photoUrl}
                alt={itemDetails.name}
                width={500}
                height={300}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
              />
            </Paper>
          ) : (
            <Typography color="text.secondary">No image available</Typography>
          )}
        </Box>
      ) : (
        <Typography color="text.secondary">Item not found</Typography>
      )}
    </Box>
  )
}

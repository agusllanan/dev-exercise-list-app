import { getItemDetails } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Typography } from '@mui/material'
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
        <>
          <Typography variant="h4">{itemDetails.name}</Typography>
          <Typography color={itemDetails.description ? 'text.primary' : 'text.secondary'}>
            {itemDetails.description || 'No description'}
          </Typography>
          {itemDetails.photoUrl && (
            <Image src={itemDetails.photoUrl} alt={itemDetails.name} width={100} height={100} />
          )}
        </>
      ) : (
        <Typography color="text.secondary">Item not found</Typography>
      )}
    </Box>
  )
}

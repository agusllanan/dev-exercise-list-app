import { AddItemButton } from '@/components/AddItemButton'
import { listMyItems } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import { pluralize } from '@/lib/utils'
import { Box, Button, Chip, Paper, Typography } from '@mui/material'

import { DeleteItemButton } from '@/components/deleteItemButton'
import { listCategories } from '@/lib/models/category'
import Image from 'next/image'

export default async function Home() {
  const authUser = await getCurrentAuthUser()
  const items = await listMyItems(authUser)
  const categories = await listCategories()

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          My Items
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {items.length.toLocaleString()} {pluralize(items.length, 'product', 'products')}
          </Typography>
          <AddItemButton categories={categories} />
        </Box>
      </Box>

      {categories.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Navigate to a category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                component="a"
                href={`/dashboard/category/${category.id}`}
                clickable
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {items.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 3,
          }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              component={Paper}
              elevation={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  backgroundColor: 'grey.100',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.photoUrl ? (
                  <>
                    <Image
                      src={item.photoUrl}
                      alt={item.name}
                      fill
                      sizes="250px"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </>
                ) : (
                  <Typography color="text.secondary">No image</Typography>
                )}
              </Box>
              <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                  {item.name}
                </Typography>

                <Box
                  sx={{
                    mt: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/dashboard/item/${item.id}`}
                    size="small"
                    fullWidth
                    sx={{ mr: 1 }}
                  >
                    View Product
                  </Button>
                  <DeleteItemButton id={item.id} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

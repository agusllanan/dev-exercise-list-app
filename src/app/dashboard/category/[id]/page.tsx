import { DeleteItemButton } from '@/components/deleteItemButton'
import { getCategoryById } from '@/lib/models/category'
import { getItemsByCategory } from '@/lib/models/item'
import { pluralize } from '@/lib/utils'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Paper, Typography } from '@mui/material'
import Image from 'next/image'

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id)
  const items = category ? await getItemsByCategory(params.id) : []

  return (
    <Box>
      <Button href={'/dashboard'} startIcon={<ArrowBackIcon />}>
        Back to dashboard
      </Button>
      {category ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4">{category.name}</Typography>
          <Typography
            color={category.description ? 'text.primary' : 'text.secondary'}
            sx={{ mb: 2 }}
          >
            {category.description || 'No description'}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              {items.length.toLocaleString()} {pluralize(items.length, 'product', 'products')}
            </Box>{' '}
            available in this category
          </Typography>

          {items.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 3,
                mt: 2,
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
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        sizes="250px"
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">No image</Typography>
                    )}
                  </Box>
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
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
                      >
                        View Details
                      </Button>
                      <DeleteItemButton id={item.id} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <Typography color="text.secondary">Category not found</Typography>
      )}
    </Box>
  )
}

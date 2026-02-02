'use client';

import Link from 'next/link';
import { IconEye, IconHeart } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { getImageUrl } from '@/utils/api';

interface Magazine {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  category?: string;
  viewCount?: number;
  likes?: number;
  author?: { name: string; image?: string };
  publishedAt?: string;
}

interface MagazineCardProps {
  magazine: Magazine;
}

export function MagazineCard({ magazine }: MagazineCardProps) {
  const coverUrl = magazine.coverImage ? getImageUrl(magazine.coverImage) : null;

  return (
    <Card
      component={Link}
      href={`/magazine/${magazine._id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        transition: (theme) =>
          theme.transitions.create(['box-shadow', 'border-color'], {
            duration: theme.transitions.duration.short,
          }),
        '&:hover': {
          boxShadow: 4,
          borderColor: 'primary.main',
        },
      }}
      variant="outlined"
    >
      <Box sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: 'grey.100' }}>
        {coverUrl ? (
          <CardMedia
            component="img"
            image={coverUrl}
            alt={magazine.title}
            sx={{
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              typography: 'h3',
              color: 'grey.400',
            }}
          >
            {magazine.title.charAt(0)}
          </Box>
        )}
      </Box>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 1, display: 'inline-block' }}
        >
          {magazine.category || 'other'}
        </Typography>
        <Typography variant="h3" component="h3" gutterBottom sx={{ lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {magazine.title}
        </Typography>
        {magazine.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {magazine.description}
          </Typography>
        )}
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {magazine.author?.name || '익명'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconEye size={14} /> {magazine.viewCount ?? 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconHeart size={14} /> {magazine.likes ?? 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

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

import {
  Avatar,
  Stack,
} from '@mui/material';

// ... interface ...

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
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.15)',
          borderColor: 'primary.main',
        },
      }}
      elevation={0}
    >
      <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'grey.100', overflow: 'hidden' }}>
        {coverUrl ? (
          <CardMedia
            component="img"
            image={coverUrl}
            alt={magazine.title}
            loading="lazy"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              opacity: 0.2,
              typography: 'h1',
              color: 'primary.main',
              fontWeight: 900,
            }}
          >
            {magazine.title.charAt(0)}
          </Box>
        )}
        <Chip
          label={magazine.category || '기타'}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            fontWeight: 700,
            color: 'text.primary',
            borderRadius: '6px',
          }}
        />
      </Box>
      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h5" 
          component="h3" 
          sx={{ 
            fontWeight: 800, 
            mb: 1.5, 
            lineHeight: 1.3,
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            letterSpacing: '-0.01em'
          }}
        >
          {magazine.title}
        </Typography>
        {magazine.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              lineHeight: 1.6,
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden' 
            }}
          >
            {magazine.description}
          </Typography>
        )}
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'grey.200', color: 'text.primary' }}>
              {magazine.author?.name?.charAt(0) || '익'}
            </Avatar>
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {magazine.author?.name || '익명'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconEye size={14} /> {new Intl.NumberFormat('ko-KR').format(magazine.viewCount ?? 0)}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

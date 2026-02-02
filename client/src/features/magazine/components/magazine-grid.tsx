'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { MagazineCard } from './magazine-card';

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

interface MagazineGridProps {
  magazines: Magazine[];
  loading?: boolean;
  emptyMessage?: string;
}

export function MagazineGrid({
  magazines,
  loading,
  emptyMessage = '등록된 글이 없습니다.',
}: MagazineGridProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={48} aria-label="로딩 중" />
      </Box>
    );
  }

  if (!magazines?.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          border: 2,
          borderColor: 'divider',
          borderStyle: 'dashed',
          borderRadius: 2,
          bgcolor: 'grey.50',
          p: 4,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          첫 글을 작성해보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {magazines.map((magazine) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={magazine._id}>
          <MagazineCard magazine={magazine} />
        </Grid>
      ))}
    </Grid>
  );
}

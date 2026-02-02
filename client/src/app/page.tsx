'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IconFilter } from '@tabler/icons-react';
import useSWR from 'swr';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { api } from '@/utils/api';
import { MagazineGrid } from '@/features/magazine/components';

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'tech', label: '기술' },
  { value: 'lifestyle', label: '라이프스타일' },
  { value: 'travel', label: '여행' },
  { value: 'food', label: '푸드' },
  { value: 'fashion', label: '패션' },
  { value: 'other', label: '기타' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'views', label: '조회수순' },
];

const fetcher = (url: string, params: any) => api.get(url, { params }).then((res: any) => res.data);

import { Container, Paper, Stack, Chip } from '@mui/material';

// ... existing CATEGORIES and SORT_OPTIONS ...

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const queryParams = useMemo(() => ({
    page,
    limit: 12,
    category: category === 'all' ? undefined : category,
    sort,
  }), [page, category, sort]);

  const { data, error, isLoading } = useSWR(
    ['/magazines', queryParams],
    ([url, params]) => fetcher(url, params),
    { keepPreviousData: true }
  );

  const updateQuery = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const magazines = data?.magazines || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 10 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'grey.900', 
          color: 'common.white', 
          py: { xs: 8, md: 12 }, 
          mb: 6,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              letterSpacing: '-0.03em'
            }}
          >
            Stories Worth Reading
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 400, 
              opacity: 0.9, 
              maxWidth: 600,
              lineHeight: 1.6
            }}
          >
            당신의 일상에 영감을 주는 깊이 있는 이야기들.<br />
            지금 당신의 매거진을 시작해보세요.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Filter Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 6, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            gap: 3
          }}
        >
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.value}
                label={c.label}
                onClick={() => updateQuery({ category: c.value, page: 1 })}
                color={category === c.value ? 'primary' : 'default'}
                variant={category === c.value ? 'filled' : 'outlined'}
                sx={{ 
                  borderRadius: '8px', 
                  px: 1,
                  fontWeight: 600,
                  '&:hover': { bgcolor: category === c.value ? 'primary.dark' : 'action.hover' }
                }}
              />
            ))}
          </Stack>

          <Box sx={{ ml: { md: 'auto' }, display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sort}
                onChange={(e: any) => updateQuery({ sort: e.target.value, page: 1 })}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                {SORT_OPTIONS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              총 {pagination.total}개
            </Typography>
          </Box>
        </Paper>

        {error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">데이터를 불러오는 중 오류가 발생했습니다.</Typography>
            <Button onClick={() => router.refresh()} sx={{ mt: 2 }} variant="outlined">다시 시도</Button>
          </Box>
        ) : (
          <MagazineGrid magazines={magazines} loading={isLoading} />
        )}

        {pagination.pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 8 }}>
            <Button
              variant="outlined"
              onClick={() => updateQuery({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
              sx={{ borderRadius: 2, px: 3 }}
            >
              이전
            </Button>
            <Typography variant="body1" fontWeight={700}>
              {page} / {pagination.pages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => updateQuery({ page: Math.min(pagination.pages, page + 1) })}
              disabled={page >= pagination.pages}
              sx={{ borderRadius: 2, px: 3 }}
            >
              다음
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}>
      <HomeContent />
    </Suspense>
  );
}

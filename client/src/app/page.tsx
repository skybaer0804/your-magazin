'use client';

import { useState, useEffect } from 'react';
import { IconFilter } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { api } from '@/utils/api';
import { MagazineGrid } from '@/features/magazine/components';

const CATEGORIES = [
  { value: '', label: '전체' },
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

export default function HomePage() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    setLoading(true);
    api
      .get('/magazines', { params: { page, limit: 12, category: category || undefined, sort } })
      .then((res) => {
        setMagazines(res.data.magazines);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch(() => setMagazines([]))
      .finally(() => setLoading(false));
  }, [page, category, sort]);

  return (
    <Box sx={{ maxWidth: 1152, mx: 'auto', px: 2, py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          매거진
        </Typography>
        <Typography variant="body1" color="text.secondary">
          사용자가 직접 페이지(메뉴)를 구성하는 데모용 매거진 웹앱입니다.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          p: 2,
          mb: 4,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconFilter size={20} />
          <Typography variant="body2" fontWeight={500}>
            필터
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="category-label">카테고리</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={category}
            label="카테고리"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c.value || 'all'} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-label">정렬</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sort}
            label="정렬"
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          총 {pagination.total}개
        </Typography>
      </Box>

      <MagazineGrid magazines={magazines} loading={loading} />

      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="이전 페이지"
          >
            이전
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            {page} / {pagination.pages}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            aria-label="다음 페이지"
          >
            다음
          </Button>
        </Box>
      )}
    </Box>
  );
}

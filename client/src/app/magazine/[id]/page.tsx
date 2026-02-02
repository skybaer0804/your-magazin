'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  IconArrowLeft,
  IconEye,
  IconHeart,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import useSWR from 'swr';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { api, getImageUrl } from '@/utils/api';
import { MagazineContent } from '@/features/magazine/components';
import { useAuth } from '@/context/AuthContext';

interface Magazine {
  _id: string;
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  category?: string;
  viewCount?: number;
  likes?: number;
  author?: { _id: string; name: string; image?: string; bio?: string };
  publishedAt?: string;
  createdAt?: string;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function MagazineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [deleting, setDeleting] = useState(false);

  const { data: magazine, error, isLoading } = useSWR<Magazine>(`/magazines/${id}`, fetcher);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await api.delete(`/magazines/${id}`);
      router.push('/');
      router.refresh();
    } catch {
      alert('삭제에 실패했습니다.');
      setDeleting(false);
    }
  };

  const formatDate = (d: string | undefined) => {
    if (!d) return '';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(d));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={32} aria-label="로딩 중" />
      </Box>
    );
  }

  if (!magazine || error) {
    return (
      <Box sx={{ maxWidth: 768, mx: 'auto', px: 2, py: 6, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          글을 찾을 수 없습니다.
        </Typography>
        <Button component={Link} href="/" sx={{ mt: 2 }}>
          목록으로
        </Button>
      </Box>
    );
  }

  const authorId = magazine.author && ('_id' in magazine.author ? String(magazine.author._id) : (magazine.author as { id?: string }).id);
  const isAuthor = user?.id && authorId && user.id === authorId;
  const coverUrl = magazine.coverImage ? getImageUrl(magazine.coverImage) : null;

  return (
    <Box sx={{ maxWidth: 768, mx: 'auto', px: 2, py: 4 }}>
      <Button
        component={Link}
        href="/"
        startIcon={<IconArrowLeft size={18} aria-hidden="true" />}
        color="inherit"
        sx={{ mb: 4, textTransform: 'none' }}
      >
        목록으로
      </Button>

      <Box component="article">
        <Box component="header" sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'inline-block',
              bgcolor: 'grey.100',
              px: 1.5,
              py: 0.25,
              borderRadius: 1,
            }}
          >
            {magazine.category || 'other'}
          </Typography>
          <Typography variant="h1" component="h1" sx={{ mt: 2, mb: 2 }}>
            {magazine.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {magazine.author?.name || '익명'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(magazine.publishedAt || magazine.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconEye size={16} aria-hidden="true" /> {new Intl.NumberFormat('ko-KR').format(magazine.viewCount ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconHeart size={16} aria-hidden="true" /> {new Intl.NumberFormat('ko-KR').format(magazine.likes ?? 0)}
            </Typography>
          </Box>
          {isAuthor && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                component={Link}
                href={`/magazine/${id}/edit`}
                variant="outlined"
                size="small"
                startIcon={<IconEdit size={16} aria-hidden="true" />}
                sx={{ textTransform: 'none' }}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<IconTrash size={16} aria-hidden="true" />}
                onClick={handleDelete}
                disabled={deleting}
                sx={{ textTransform: 'none' }}
              >
                {deleting ? '삭제 중…' : '삭제'}
              </Button>
            </Box>
          )}
        </Box>

        {coverUrl && (
          <Box sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
            <Box
              component="img"
              src={coverUrl}
              alt={magazine.title}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        )}

        {magazine.description && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            {magazine.description}
          </Typography>
        )}

        <MagazineContent html={magazine.content} />
      </Box>
    </Box>
  );
}

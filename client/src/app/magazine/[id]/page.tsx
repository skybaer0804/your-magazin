'use client';

import { useState } from 'react';
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
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
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
  likedBy?: string[];
  author?: { _id: string; name: string; image?: string; bio?: string };
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  tech: '기술',
  lifestyle: '라이프스타일',
  travel: '여행',
  food: '푸드',
  fashion: '패션',
  other: '기타',
};

const fetcher = (url: string) => api.get(url).then((res: any) => res.data);

export default function MagazineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  const { data: magazine, error, isLoading, mutate } = useSWR<Magazine>(`/magazines/${id}`, fetcher);

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

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      router.push('/login');
      return;
    }
    if (liking) return;
    setLiking(true);
    try {
      await api.post(`/magazines/${id}/like`);
      mutate();
    } catch {
      alert('좋아요 처리에 실패했습니다.');
    } finally {
      setLiking(false);
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

  // 작성자 확인 로직 개선 (id와 _id 모두 대응)
  const loggedInUserId = user?.id || (user as any)?._id;
  const authorId = magazine.author && (typeof magazine.author === 'object' ? (magazine.author._id || (magazine.author as any).id) : magazine.author);
  const isAuthor = loggedInUserId && authorId && String(loggedInUserId) === String(authorId);
  
  const isLiked = loggedInUserId && magazine.likedBy?.includes(String(loggedInUserId));
  const coverUrl = magazine.coverImage ? getImageUrl(magazine.coverImage) : null;

  return (
    <Box sx={{ maxWidth: 768, mx: 'auto', px: 2, py: 6 }}>
      <Box component="article">
        <Box component="header" sx={{ mb: 6 }}>
          {/* Header Row: Thumbnail + Title + Category */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            {coverUrl && (
              <Avatar
                variant="rounded"
                src={coverUrl}
                sx={{ 
                  width: 64, 
                  height: 64, 
                  flexShrink: 0, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {magazine.title}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 1,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    lineHeight: 1
                  }}
                >
                  {CATEGORY_MAP[magazine.category || 'other'] || '기타'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Metadata & Actions Row */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', rowGap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={magazine.author?.image} sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                {magazine.author?.name?.charAt(0)}
              </Avatar>
              <Typography variant="subtitle2" fontWeight={700}>
                {magazine.author?.name || '익명'}
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', display: { xs: 'none', sm: 'block' } }} />
            
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.2 }}>
                작성일: {formatDate(magazine.createdAt || magazine.publishedAt)}
              </Typography>
              {magazine.updatedAt && magazine.createdAt && 
               new Date(magazine.updatedAt).getTime() - new Date(magazine.createdAt).getTime() > 60000 && (
                <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', display: 'block', lineHeight: 1.2 }}>
                  (수정일: {formatDate(magazine.updatedAt)})
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconEye size={16} /> {new Intl.NumberFormat('ko-KR').format(magazine.viewCount ?? 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconHeart size={16} /> {new Intl.NumberFormat('ko-KR').format(magazine.likes ?? 0)}
              </Typography>
            </Box>

            {/* 상단 수정/삭제 버튼 - 모바일에서도 보이도록 display 수정 */}
            {isAuthor && (
              <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                <Button
                  component={Link}
                  href={`/magazine/${id}/edit`}
                  variant="outlined"
                  size="small"
                  startIcon={<IconEdit size={14} />}
                  sx={{ borderRadius: '16px', textTransform: 'none', py: 0.5, fontSize: '0.75rem' }}
                >
                  수정
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<IconTrash size={14} />}
                  onClick={handleDelete}
                  disabled={deleting}
                  sx={{ borderRadius: '16px', textTransform: 'none', py: 0.5, fontSize: '0.75rem' }}
                >
                  {deleting ? '...' : '삭제'}
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* 중복 이미지를 방지하기 위해 상세 페이지 본문 전 coverImage 섹션 제거 */}

        {magazine.description && (
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary', 
              fontWeight: 400, 
              lineHeight: 1.6,
              borderLeft: 4,
              borderColor: 'primary.main',
              pl: 3,
              py: 0.5,
              fontSize: '1.1rem'
            }}
          >
            {magazine.description}
          </Typography>
        )}

        <MagazineContent html={magazine.content} />

        <Divider sx={{ my: 6 }} />

        {/* Bottom Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant={isLiked ? "contained" : "outlined"}
              color="error"
              startIcon={<IconHeart size={20} fill={isLiked ? "currentColor" : "none"} />}
              onClick={handleLike}
              disabled={liking}
              sx={{ borderRadius: '24px', px: 3 }}
            >
              좋아요 {magazine.likes}
            </Button>

            {isAuthor && (
              <>
                <Button
                  component={Link}
                  href={`/magazine/${id}/edit`}
                  variant="outlined"
                  startIcon={<IconEdit size={20} />}
                  sx={{ borderRadius: '24px', px: 3 }}
                >
                  수정
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<IconTrash size={20} />}
                  onClick={handleDelete}
                  disabled={deleting}
                  sx={{ borderRadius: '24px', px: 3 }}
                >
                  {deleting ? '삭제 중…' : '삭제'}
                </Button>
              </>
            )}
          </Stack>

          <Button
            component={Link}
            href="/"
            variant="text"
            color="inherit"
            startIcon={<IconArrowLeft size={20} />}
            sx={{ borderRadius: '24px', px: 3 }}
          >
            목록으로
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

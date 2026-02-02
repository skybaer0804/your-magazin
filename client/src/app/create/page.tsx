'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { IconDeviceFloppy, IconX, IconPhotoUp } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { api, getImageUrl } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Editor from '@/components/Editor';
import { Menu } from '@/types';

const CATEGORIES = ['lifestyle', 'tech', 'travel', 'food', 'fashion', 'other'];
const CATEGORY_LABELS: Record<string, string> = {
  lifestyle: '라이프스타일',
  tech: '기술',
  travel: '여행',
  food: '푸드',
  fashion: '패션',
  other: '기타',
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

function CreateContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('other');
  const [menuId, setMenuId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetcher('/config'),
  });
  const menus = (config?.menus as Menu[]) || [];

  const isDirty = title || description || content || coverImage || tags.length > 0 || menuId;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(data.url);
      toast.success('이미지가 업로드되었습니다.');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || '업로드 실패';
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }, []);

  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((t: string) => {
    setTags((prev: string[]) => prev.filter((x: string) => x !== t));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('제목을 입력해주세요.');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      toast.warning('내용을 입력해주세요.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api.post('/magazines', {
        title: title.trim(),
        description: description.trim(),
        content,
        coverImage: coverImage || null,
        category,
        menuId: menuId || null,
        tags,
      });
      toast.success('글이 성공적으로 작성되었습니다.');
      window.removeEventListener('beforeunload', () => {}); 
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || '저장 실패';
      setError(msg);
      toast.error(msg);
      setSaving(false);
    }
  }, [title, description, content, coverImage, category, tags, router, menuId]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <Box sx={{ maxWidth: 896, mx: 'auto', px: 2, py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h2" component="h1">
          새 글 쓰기
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<IconX size={18} />} sx={{ textTransform: 'none' }}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={<IconDeviceFloppy size={18} />}
            sx={{ textTransform: 'none' }}
          >
            {saving ? '저장 중…' : '저장'}
          </Button>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <TextField
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
          fullWidth
          autoComplete="off"
        />
        <TextField
          label="설명 (미리보기)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="간단한 설명을 입력하세요"
          fullWidth
          autoComplete="off"
        />

        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            썸네일 이미지
          </Typography>
          <Box
            component="label"
            sx={{
              display: 'flex',
              height: 128,
              width: 192,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: 2,
              borderColor: 'divider',
              borderStyle: 'dashed',
              borderRadius: 1,
              bgcolor: 'grey.50',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            {coverImage ? (
              <Box component="img" src={getImageUrl(coverImage)} alt="Thumbnail Preview" sx={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: 1 }} />
            ) : (
              <>
                <Box sx={{ color: 'grey.400' }}>
                  <IconPhotoUp size={32} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {uploading ? '업로드 중…' : '클릭하여 선택'}
                </Typography>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
              hidden
              aria-label="썸네일 이미지 업로드"
            />
          </Box>
        </Box>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="category-label">카테고리</InputLabel>
          <Select labelId="category-label" id="category-select" value={category} label="카테고리" onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="menu-label">메뉴 (옵션)</InputLabel>
          <Select 
            labelId="menu-label" 
            id="menu-select" 
            value={menuId} 
            label="메뉴 (옵션)" 
            onChange={(e) => setMenuId(e.target.value)}
          >
            <MenuItem value="">없음</MenuItem>
            {menus.map((m: Menu) => (
              <MenuItem key={m._id} value={m._id}>
                {m.title}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
            선택 시 헤더 메뉴의 드롭다운에 표시됩니다.
          </Typography>
        </FormControl>

        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            태그
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {tags.map((t) => (
              <Chip key={t} label={t} onDelete={() => removeTag(t)} size="small" />
            ))}
            <TextField
              size="small"
              placeholder="태그 입력 후 Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              sx={{ width: 160 }}
            />
            <Button variant="outlined" size="small" onClick={addTag} sx={{ textTransform: 'none' }}>
              추가
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            본문
          </Typography>
          <Editor value={content} onChange={setContent} placeholder="내용을 입력하세요…" />
        </Box>
      </Box>
    </Box>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={32} />
      </Box>
    }>
      <CreateContent />
    </Suspense>
  );
}

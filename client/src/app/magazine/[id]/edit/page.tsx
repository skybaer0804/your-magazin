'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { api, getImageUrl } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Editor from '@/components/Editor';

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

function EditMagazineContent() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const id = params.id as string;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('other');
  const [menuId, setMenuId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetcher('/config'),
  });
  const menus = config?.menus || [];

  const { data: magazine, error: magazineError, isLoading: magazineLoading } = useQuery({
    queryKey: ['magazine', id],
    queryFn: () => fetcher(`/magazines/${id}`),
  });

  useEffect(() => {
    if (magazine) {
      setTitle(magazine.title);
      setDescription(magazine.description || '');
      setContent(magazine.content || '');
      setCoverImage(magazine.coverImage || '');
      setCategory(magazine.category || 'other');
      setMenuId(magazine.menuId || '');
      setTags(magazine.tags || []);
      setInitialData(magazine);
      setLoading(false);
    }
  }, [magazine]);

  useEffect(() => {
    if (magazineError) {
      const msg = '글을 불러올 수 없습니다.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  }, [magazineError]);

  const isDirty = useMemo(() => {
    if (!initialData) return false;
    return (
      title !== initialData.title ||
      description !== (initialData.description || '') ||
      content !== (initialData.content || '') ||
      coverImage !== (initialData.coverImage || '') ||
      category !== (initialData.category || 'other') ||
      menuId !== (initialData.menuId || '') ||
      JSON.stringify(tags) !== JSON.stringify(initialData.tags || [])
    );
  }, [title, description, content, coverImage, category, menuId, tags, initialData]);

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
    } catch (err: any) {
      const msg = err.response?.data?.message || '업로드 실패';
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
      await api.put(`/magazines/${id}`, {
        title: title.trim(),
        description: description.trim(),
        content,
        coverImage: coverImage || null,
        category,
        menuId: menuId || null,
        tags,
      });
      toast.success('글이 성공적으로 수정되었습니다.');
      window.removeEventListener('beforeunload', () => {});
      router.push(`/magazine/${id}`);
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.message || '저장 실패';
      setError(msg);
      toast.error(msg);
      setSaving(false);
    }
  }, [id, title, description, content, coverImage, category, tags, router, menuId]);

  if (authLoading || loading) {
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

  if (error && !title) {
    return (
      <Box sx={{ maxWidth: 896, mx: 'auto', px: 2, py: 6, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => router.back()} sx={{ textTransform: 'none' }}>
          돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 896, mx: 'auto', px: 2, py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h2" component="h1">
          글 수정
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
          required
          fullWidth
          autoComplete="off"
        />
        <TextField
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          autoComplete="off"
        />

        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            썸네일
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
            {menus.map((m: any) => (
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
              placeholder="태그 + Enter"
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
          <Editor value={content} onChange={setContent} />
        </Box>
      </Box>
    </Box>
  );
}

export default function EditMagazinePage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={32} />
      </Box>
    }>
      <EditMagazineContent />
    </Suspense>
  );
}

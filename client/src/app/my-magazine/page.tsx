'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Stack,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { IconPlus, IconTrash, IconSettings, IconMenu2, IconInfoCircle } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

function MyMagazineContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetcher('/config'),
  });
  
  const [siteTitle, setSiteTitle] = useState('');
  const [logoText, setLogoText] = useState('');
  const [menus, setMenus] = useState<{ title: string; order: number; _id?: string }[]>([]);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (config) {
      setSiteTitle(config.siteTitle || '');
      setLogoText(config.logoText || '');
      setMenus(config.menus || []);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => api.put('/config', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      toast.success('저장되었습니다.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || '저장 중 오류가 발생했습니다.';
      setError(msg);
      toast.error(msg);
    },
    onSettled: () => {
      setSaving(false);
    }
  });

  const handleSaveInfo = async () => {
    setSaving(true);
    setError('');
    saveMutation.mutate({ siteTitle, logoText });
  };

  const handleAddMenu = () => {
    if (!newMenuTitle) return;
    if (menus.length >= 5) {
      toast.warning('메뉴는 최대 5개까지만 추가할 수 있습니다.');
      return;
    }
    if (newMenuTitle.length > 6) {
      toast.warning('메뉴 이름은 6글자 이하로 입력해주세요.');
      return;
    }
    const newMenus = [...menus, { title: newMenuTitle, order: menus.length }];
    setMenus(newMenus);
    setNewMenuTitle('');
  };

  const handleDeleteMenu = (index: number) => {
    const newMenus = menus.filter((_, i) => i !== index);
    setMenus(newMenus);
  };

  const handleSaveMenus = async () => {
    setSaving(true);
    setError('');
    saveMutation.mutate({ menus });
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconSettings size={32} />
        <Typography variant="h4" fontWeight={800}>내 매거진 관리</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<IconInfoCircle size={20} />} iconPosition="start" label="Info" sx={{ py: 2, fontWeight: 700 }} />
          <Tab icon={<IconMenu2 size={20} />} iconPosition="start" label="Menu" sx={{ py: 2, fontWeight: 700 }} />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {tab === 0 && (
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700} color="text.secondary">
                  매거진 타이틀
                </Typography>
                <TextField
                  fullWidth
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="예: YOUR MAGAZINE"
                  variant="outlined"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700} color="text.secondary">
                  로고 텍스트 (최대 2자)
                </Typography>
                <TextField
                  fullWidth
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value.slice(0, 2))}
                  placeholder="예: M"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ pt: 2 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleSaveInfo}
                  disabled={saving}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                >
                  {saving ? '저장 중...' : '기본 정보 저장'}
                </Button>
              </Box>
            </Stack>
          )}

          {tab === 1 && (
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700} color="text.secondary">
                  메뉴 추가 (최대 5개, 6자 이내)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newMenuTitle}
                    onChange={(e) => setNewMenuTitle(e.target.value)}
                    placeholder="메뉴 이름 입력"
                    variant="outlined"
                  />
                  <Button 
                    variant="outlined" 
                    startIcon={<IconPlus size={18} />}
                    onClick={handleAddMenu}
                    sx={{ px: 3, whiteSpace: 'nowrap' }}
                  >
                    추가
                  </Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700} color="text.secondary">
                  현재 메뉴 목록
                </Typography>
                <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  {menus.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="설정된 메뉴가 없습니다." sx={{ color: 'text.disabled', textAlign: 'center' }} />
                    </ListItem>
                  ) : (
                    menus.map((menu, index) => (
                      <Box key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={menu.title} 
                            secondary={`${index + 1}번 메뉴`}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteMenu(index)} color="error">
                              <IconTrash size={20} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < menus.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                </List>
              </Box>

              <Box sx={{ pt: 2 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleSaveMenus}
                  disabled={saving}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                >
                  {saving ? '저장 중...' : '메뉴 구성 저장'}
                </Button>
              </Box>
            </Stack>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default function MyMagazinePage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}>
      <MyMagazineContent />
    </Suspense>
  );
}

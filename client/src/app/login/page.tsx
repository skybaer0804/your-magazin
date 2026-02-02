'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconMail, IconLock, IconArrowRight } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('로그인되었습니다.');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.message || '로그인에 실패했습니다.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 448, mx: 'auto', px: 2, py: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100vh - 8rem)' }}>
      <Box sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          계정이 없으신가요?{' '}
          <Box component={Link} href="/register" sx={{ fontWeight: 500, color: 'primary.main', textDecoration: 'underline' }}>
            회원가입
          </Box>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <TextField
            id="email"
            type="email"
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
            slotProps={{
              htmlInput: { spellCheck: 'false' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconMail size={20} aria-hidden="true" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id="password"
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconLock size={20} aria-hidden="true" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={<IconArrowRight size={20} aria-hidden="true" />} sx={{ textTransform: 'none' }}>
            {loading ? '로그인 중…' : '로그인'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

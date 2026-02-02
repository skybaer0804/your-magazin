'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconMail, IconLock, IconUser, IconArrowRight } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              '회원가입에 실패했습니다.'
          : '회원가입에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 448, mx: 'auto', px: 2, py: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100vh - 8rem)' }}>
      <Box sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          회원가입
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          이미 계정이 있으신가요?{' '}
          <Box component={Link} href="/login" sx={{ fontWeight: 500, color: 'primary.main', textDecoration: 'underline' }}>
            로그인
          </Box>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <TextField
            id="name"
            type="text"
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="홍길동"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconUser size={20} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id="email"
            type="email"
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconMail size={20} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id="password"
            type="password"
            label="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconLock size={20} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id="passwordConfirm"
            type="password"
            label="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            placeholder="••••••••"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconLock size={20} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={<IconArrowRight size={20} />} sx={{ textTransform: 'none' }}>
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

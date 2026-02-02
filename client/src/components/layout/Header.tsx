'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconMenu2,
  IconX,
  IconPlus,
  IconLogin,
  IconLogout,
} from '@tabler/icons-react';
import useSWR from 'swr';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  AppBar,
  Toolbar,
  Container,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Magazine {
  _id: string;
  title: string;
}

const fetcher = (url: string) => api.get(url, { params: { limit: 20, sort: 'latest' } }).then((res: any) => res.data);

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const { data } = useSWR('/magazines', fetcher);
  const magazines: Magazine[] = data?.magazines || [];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0} 
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 800,
              }}
            >
              M
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              YOUR MAGAZINE
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <Button
              component={Link}
              href="/"
              color="inherit"
              sx={{ 
                fontWeight: pathname === '/' ? 700 : 500,
                px: 2
              }}
            >
              홈
            </Button>
            {magazines.map((m) => (
              <Button
                key={m._id}
                component={Link}
                href={`/magazine/${m._id}`}
                color="inherit"
                sx={{ 
                  fontWeight: pathname === `/magazine/${m._id}` ? 700 : 500,
                  px: 2
                }}
              >
                {m.title}
              </Button>
            ))}
          </Stack>

          {/* Right Side Actions */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {user ? (
              <>
                <Button
                  component={Link}
                  href="/create"
                  variant="contained"
                  disableElevation
                  startIcon={<IconPlus size={20} />}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    borderRadius: '20px',
                    px: 2.5,
                    fontWeight: 600
                  }}
                >
                  새 글 쓰기
                </Button>
                
                <IconButton 
                  onClick={handleUserMenuOpen}
                  sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}
                >
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: 'grey.200', color: 'text.primary', fontSize: '0.9rem' }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                </IconButton>

                <Menu
                  id="user-menu"
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, minWidth: 180, borderRadius: 2 }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={Link} href="/create" onClick={handleUserMenuClose} sx={{ py: 1 }}>
                    <IconPlus size={18} style={{ marginRight: 12 }} /> 새 글 쓰기
                  </MenuItem>
                  <MenuItem onClick={() => { logout(); handleUserMenuClose(); }} sx={{ py: 1, color: 'error.main' }}>
                    <IconLogout size={18} style={{ marginRight: 12 }} /> 로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                startIcon={<IconLogin size={20} />}
                sx={{ borderRadius: '20px', px: 2.5, fontWeight: 600 }}
              >
                로그인
              </Button>
            )}

            <IconButton
              onClick={() => setMenuOpen(!menuOpen)}
              sx={{ display: { md: 'none' } }}
            >
              {menuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      {menuOpen && (
        <Box sx={{ display: { md: 'none' }, borderTop: 1, borderColor: 'divider', py: 2 }}>
          <Container maxWidth="lg">
            <Stack spacing={1}>
              <Button component={Link} href="/" color="inherit" onClick={() => setMenuOpen(false)} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                홈
              </Button>
              {magazines.map((m) => (
                <Button key={m._id} component={Link} href={`/magazine/${m._id}`} color="inherit" onClick={() => setMenuOpen(false)} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                  {m.title}
                </Button>
              ))}
              {user && (
                <Button component={Link} href="/create" color="primary" variant="outlined" onClick={() => setMenuOpen(false)} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                  <IconPlus size={20} style={{ marginRight: 8 }} /> 새 글 쓰기
                </Button>
              )}
            </Stack>
          </Container>
        </Box>
      )}
    </AppBar>
  );
}

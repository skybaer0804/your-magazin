'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconMenu2,
  IconX,
  IconPlus,
  IconLogin,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
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

interface Menu {
  _id: string;
  title: string;
}

interface SiteConfig {
  siteTitle: string;
  logoText: string;
  menus: Menu[];
}

const fetcher = (url: string) => api.get(url).then((res: any) => res.data);

function MenuDropdown({ menu }: { menu: Menu }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const { data: magazines } = useQuery({
    queryKey: ['magazines', 'by-menu', menu._id],
    queryFn: () => fetcher(`/magazines/by-menu/${menu._id}`),
    enabled: open,
  });

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      sx={{ position: 'relative' }}
    >
      <Button
        component={Link}
        href={`/?menuId=${menu._id}`}
        color="inherit"
        sx={{ 
          fontWeight: 500,
          px: 2,
          height: 72,
          borderRadius: 0,
          borderBottom: open ? '2px solid' : 'none',
          borderColor: 'primary.main'
        }}
      >
        {menu.title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          onMouseEnter: () => {}, 
          onMouseLeave: handleClose,
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          elevation: 3,
          sx: { mt: 0, minWidth: 200, borderRadius: '0 0 8px 8px' }
        }}
        sx={{ pointerEvents: 'none' }}
      >
        <Box sx={{ pointerEvents: 'auto' }}>
          {magazines && magazines.length > 0 ? (
            magazines.map((m: any) => (
              <MenuItem 
                key={m._id} 
                component={Link} 
                href={`/magazine/${m._id}`}
                onClick={handleClose}
                sx={{ py: 1.5, fontSize: '0.9rem' }}
              >
                {m.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled sx={{ py: 1.5, fontSize: '0.9rem', color: 'text.disabled' }}>
              글이 없습니다.
            </MenuItem>
          )}
        </Box>
      </Menu>
    </Box>
  );
}

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const { data: config } = useQuery<SiteConfig>({
    queryKey: ['config'],
    queryFn: () => fetcher('/config'),
    initialData: { siteTitle: 'YOUR MAGAZINE', logoText: 'M', menus: [] }
  });
  
  const siteTitle = config?.siteTitle || 'YOUR MAGAZINE';
  const logoText = config?.logoText || 'M';
  const navMenus: Menu[] = config?.menus || [];

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
              {logoText}
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {siteTitle}
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={0}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            {navMenus.map((menu) => (
              <MenuDropdown key={menu._id} menu={menu} />
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
                    {user?.name?.charAt(0) || 'U'}
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
                  <MenuItem component={Link} href="/my-magazine" onClick={handleUserMenuClose} sx={{ py: 1 }}>
                    <IconSettings size={18} style={{ marginRight: 12 }} /> 내 매거진 관리
                  </MenuItem>
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
              {navMenus.map((menu) => (
                <Button key={menu._id} component={Link} href={`/?menuId=${menu._id}`} color="inherit" onClick={() => setMenuOpen(false)} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                  {menu.title}
                </Button>
              ))}
              <Divider sx={{ my: 1 }} />
              <Button component={Link} href="/my-magazine" color="inherit" onClick={() => setMenuOpen(false)} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                <IconSettings size={20} style={{ marginRight: 8 }} /> My Magazine
              </Button>
            </Stack>
          </Container>
        </Box>
      )}
    </AppBar>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconMenu2,
  IconX,
  IconHome,
  IconPlus,
  IconLogin,
  IconLogout,
  IconUser,
  IconChevronDown,
} from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Magazine {
  _id: string;
  title: string;
}

const NavLink = ({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    component={Link}
    href={href}
    startIcon={Icon ? <Icon size={18} /> : undefined}
    color="inherit"
    sx={{
      textTransform: 'none',
      fontWeight: isActive ? 600 : 500,
      bgcolor: isActive ? 'action.selected' : 'transparent',
      '&:hover': { bgcolor: 'action.hover' },
    }}
    onClick={onClick}
  >
    {label}
  </Button>
);

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [magazines, setMagazines] = useState<Magazine[]>([]);

  useEffect(() => {
    api
      .get('/magazines', { params: { limit: 20, sort: 'latest' } })
      .then((res) => setMagazines(res.data.magazines || []))
      .catch(() => setMagazines([]));
  }, [pathname]);

  const navLinks = [
    { href: '/', label: '홈', icon: IconHome },
    ...magazines.map((m) => ({ href: `/magazine/${m._id}`, label: m.title, id: m._id })),
    ...(user ? [{ href: '/create', label: '새 글 쓰기', icon: IconPlus }] : []),
  ];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          maxWidth: 1152,
          mx: 'auto',
          px: 2,
        }}
      >
        <Box
          component={Link}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            sx={{
              borderRadius: 0.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              px: 0.5,
              py: 0.25,
            }}
          >
            <Typography component="span" variant="h6" fontWeight={700}>
              M
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} component="span">
            매거진
          </Typography>
        </Box>

        <Box
          component="nav"
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={'icon' in link ? link.icon : undefined}
              isActive={pathname === link.href}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <Button
                aria-label={`${user.name} 사용자 메뉴`}
                aria-controls={userMenuAnchor ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuAnchor ? 'true' : undefined}
                onClick={handleUserMenuOpen}
                startIcon={<IconUser size={18} />}
                endIcon={<IconChevronDown size={16} />}
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                {user.name}
              </Button>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                MenuListProps={{ 'aria-labelledby': 'user-menu-button' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  component={Link}
                  href="/create"
                  onClick={handleUserMenuClose}
                  sx={{ gap: 1 }}
                >
                  <IconPlus size={16} /> 새 글 쓰기
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    handleUserMenuClose();
                  }}
                  sx={{ gap: 1 }}
                >
                  <IconLogout size={16} /> 로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              href="/login"
              variant="contained"
              startIcon={<IconLogin size={18} />}
              sx={{ textTransform: 'none' }}
            >
              로그인
            </Button>
          )}

          <IconButton
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(!menuOpen)}
            sx={{ display: { md: 'none' } }}
          >
            {menuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </IconButton>
        </Box>
      </Box>

      {menuOpen && (
        <Box
          sx={{
            display: { md: 'none' },
            borderTop: 1,
            borderColor: 'divider',
            px: 2,
            py: 2,
          }}
        >
          <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={'icon' in link ? link.icon : undefined}
                isActive={pathname === link.href}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

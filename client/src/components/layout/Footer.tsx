'use client';

import Link from 'next/link';
import { IconMail, IconBrandGithub } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'grey.50',
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 1152, mx: 'auto', px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                borderRadius: 0.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                px: 0.5,
                py: 0.25,
              }}
            >
              <Typography variant="caption" fontWeight={700}>
                M
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              매거진 웹앱
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={Link}
              href="/"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
            >
              홈
            </Typography>
            <Typography
              component={Link}
              href="/create"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
            >
              새 글 쓰기
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
          <IconButton
            component="a"
            href="mailto:hello@example.com"
            aria-label="이메일 문의"
            size="small"
          >
            <IconMail size={20} />
          </IconButton>
          <IconButton component="a" href="#" aria-label="GitHub" size="small">
            <IconBrandGithub size={20} />
          </IconButton>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 4 }}
        >
          © {new Date().getFullYear()} 매거진 웹앱. 데모용 프로젝트입니다.
        </Typography>
      </Box>
    </Box>
  );
}

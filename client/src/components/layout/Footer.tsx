'use client';

import Link from 'next/link';
import { IconMail, IconBrandGithub } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {
  Container,
  Grid,
  Stack,
  Divider,
} from '@mui/material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                M
              </Box>
              <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
                YOUR MAGAZINE
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
              세상의 다양한 이야기를 담는 나만의 매거진.<br />
              당신의 영감을 기록하고 공유해보세요.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Typography
                component={Link}
                href="/"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                홈
              </Typography>
              <Typography
                component={Link}
                href="/create"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                새 글 쓰기
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Social
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="mailto:hello@example.com"
                aria-label="이메일 문의"
                size="small"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <IconMail size={18} />
              </IconButton>
              <IconButton 
                component="a" 
                href="#" 
                aria-label="GitHub" 
                size="small"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <IconBrandGithub size={18} />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} YOUR MAGAZINE. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            데모용 프로젝트입니다.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

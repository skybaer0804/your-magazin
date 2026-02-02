'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { getImageUrl } from '@/utils/api';

interface MagazineContentProps {
  html: string;
}

export function MagazineContent({ html }: MagazineContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const imgs = ref.current.querySelectorAll<HTMLImageElement>('img[src^="/uploads/"]');
    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        img.setAttribute('src', getImageUrl(src));
      }
    });
  }, [html]);

  return (
    <Box
      ref={ref}
      sx={{
        '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
        '& a': { color: 'primary.main', textDecoration: 'none' },
        '& a:hover': { textDecoration: 'underline' },
        '& h1': { typography: 'h2', mt: 4, mb: 2 },
        '& h2': { typography: 'h3', mt: 3, mb: 2 },
        '& p': { typography: 'body1', my: 2 },
        '& ul, & ol': { pl: 4, my: 2 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

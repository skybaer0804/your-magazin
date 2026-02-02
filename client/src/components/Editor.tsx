'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import 'react-quill-new/dist/quill.snow.css';

// 클라이언트 사이드에서만 Quill 모듈 등록
if (typeof window !== 'undefined') {
  const { Quill } = require('react-quill-new');
  const ImageResize = require('quill-image-resize-module-react').default;
  if (Quill && ImageResize) {
    try {
      Quill.register('modules/imageResize', ImageResize);
    } catch (e) {
      console.warn('Quill ImageResize registration failed or already registered:', e);
    }
  }
}

// react-quill-new는 SSR 미지원으로 dynamic import (ssr: false)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} aria-label="에디터 로딩 중" />
  ),
});

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export default function Editor({
  value,
  onChange,
  placeholder = '내용을 입력하세요…',
  readOnly = false,
  className = '',
}: EditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    imageResize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
  }), []);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'link',
    'image',
    'video',
  ];

  if (!mounted) {
    return (
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
    );
  }

  return (
    <Box sx={{ '& .quill': { bgcolor: 'background.paper' } }} className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </Box>
  );
}

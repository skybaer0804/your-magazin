'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import 'react-quill-new/dist/quill.snow.css';

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

const defaultModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const defaultFormats = [
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

export default function Editor({
  value,
  onChange,
  placeholder = '내용을 입력하세요…',
  readOnly = false,
  className = '',
}: EditorProps) {
  const modules = useMemo(() => defaultModules, []);
  const formats = useMemo(() => defaultFormats, []);

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

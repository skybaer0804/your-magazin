# 매거진 웹앱 - 스키마 구성 & 개발 가이드

## 📋 프로젝트 개요

**기술 스택**
- Frontend: Next.js, MUI, react-quill-new
- Backend: Express.js, Node.js
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer

**주요 기능**
- 사용자 인증 (로그인)
- 매거진 아이템 그리드 표시
- 마거진 아이템 생성 (로그인 사용자만)
- 이미지/비디오 업로드

---

## 🗄️ MongoDB 스키마 구성

### 1. User Schema

```javascript
// models/User.js
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null, // 프로필 이미지 URL
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
```

**주요 필드**
- `email`: 유니크 이메일 (로그인용)
- `password`: 해시된 비밀번호 (bcrypt)
- `name`: 사용자 이름
- `image`: 프로필 이미지 URL
- `bio`: 사용자 소개글
- `role`: 사용자 역할
- `isVerified`: 이메일 인증 여부
- `timestamps`: 생성/수정 시간 자동 기록

---

### 2. Magazine Schema (게시물)

```javascript
// models/Magazine.js
const magazineSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String, // react-quill-new HTML content
      required: true,
    },
    coverImage: {
      type: String, // 썸네일 이미지 URL
      default: null,
    },
    images: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videos: [
      {
        filename: String,
        url: String,
        videoType: {
          type: String,
          enum: ['upload', 'embed'], // 자체 업로드 또는 외부 임베드
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['lifestyle', 'tech', 'travel', 'food', 'fashion', 'other'],
      default: 'other',
    },
    tags: [String],
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
```

**주요 필드**
- `title`: 게시물 제목
- `content`: react-quill-new로 작성한 HTML 콘텐츠
- `coverImage`: 썸네일 이미지
- `images`: 본문에 포함된 이미지 배열
- `videos`: 임베드된 비디오 정보
- `author`: 작성자 User 참조
- `category`: 카테고리 (라이프스타일, 기술, 여행 등)
- `tags`: 검색 태그
- `viewCount`: 조회수
- `likes`: 좋아요 수
- `comments`: 댓글 배열
- `status`: 초안/발행 상태

---

### 3. File Upload 디렉토리 구조

```
server/
├── routes/
├── controllers/
├── models/
├── middleware/
└── uploads/           ← 파일 저장 경로
    ├── images/        ← 이미지 파일
    └── videos/        ← 비디오 파일
```

**파일 명명 규칙**
```
[timestamp]-[randomstring].[extension]
예: 1706607600000-abc123def.jpg
```

---

## 🛠️ 개발 Todolist

### Phase 1: 프로젝트 초기 설정 (1-2일)

#### Backend 설정
- [ ] Express 서버 기본 구조 설정
- [ ] MongoDB 연결 설정 (mongoose)
- [ ] CORS 설정
- [ ] 환경 변수 (.env) 설정
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT`
  - `NODE_ENV`
  - `UPLOAD_DIR`
- [ ] Error handling 미들웨어 구현
- [ ] Logger 설정 (morgan 또는 winston)

#### Frontend 설정
- [ ] Next.js 프로젝트 초기 설정
- [ ] MUI 설치 및 Theme 설정
- [ ] react-quill-new 설치
- [ ] Axios 인스턴스 생성 (API 요청용)
- [ ] 환경 변수 설정
  - `NEXT_PUBLIC_API_URL`
- [ ] 폴더 구조 정리
  - `/pages`
  - `/components`
  - `/utils`
  - `/hooks`
  - `/store` (Redux 등)

---

### Phase 2: 인증 구현 (2-3일)

#### Backend - 사용자 관리
- [ ] User Schema 정의 및 모델 생성
- [ ] Password 암호화 (bcrypt) 미들웨어
- [ ] 회원가입 API 구현
  - Route: `POST /api/auth/register`
  - 필드: email, password, name
  - 검증: 이메일 중복, 비밀번호 길이 등
- [ ] 로그인 API 구현
  - Route: `POST /api/auth/login`
  - JWT 토큰 생성 및 반환
  - Response: token, user info
- [ ] 토큰 검증 미들웨어
  - 요청 헤더의 Authorization 확인
  - JWT 검증 및 사용자 정보 추출
- [ ] 로그아웃 기능 (토큰 블랙리스트 - 선택사항)

#### Frontend - 인증 UI & 로직
- [ ] 로그인 페이지 UI (MUI)
  - 이메일 입력 필드
  - 비밀번호 입력 필드
  - 로그인 버튼
  - 회원가입 링크
- [ ] 회원가입 페이지 UI
  - 이메일, 비밀번호, 비밀번호 확인, 이름 입력
  - 유효성 검사
  - 회원가입 버튼
- [ ] 로그인 로직 구현
  - API 호출 (POST /auth/login)
  - 토큰 저장 (localStorage 또는 쿠키)
  - 사용자 상태 관리 (Redux/Context)
  - 로그인 성공 후 메인 페이지로 리다이렉트
- [ ] 자동 로그인 (토큰이 있는 경우)
- [ ] Protected Routes 구현
  - 로그인 상태에서만 접근 가능한 페이지

---

### Phase 3: 매거진 목록 페이지 (2-3일)

#### Backend - 매거진 조회 API
- [ ] Magazine Schema 정의 및 모델 생성
- [ ] 전체 매거진 조회 API
  - Route: `GET /api/magazines`
  - Query: page, limit, category, sort
  - Response: 매거진 배열 + 페이지네이션 정보
- [ ] 카테고리별 필터링
  - Query parameter: `?category=tech`
- [ ] 정렬 기능
  - 최신순, 인기순, 조회수 순
- [ ] 상세 조회 API
  - Route: `GET /api/magazines/:id`
  - 조회수 증가 기능

#### Frontend - 매거진 목록 페이지
- [ ] 메인 페이지 구조
  - 헤더 (로고, 네비게이션, 사용자 메뉴)
  - 히어로 섹션 (배너)
  - 매거진 그리드 섹션
  - 푸터
- [ ] 매거진 그리드 UI
  - MUI Grid 컴포넌트 사용
  - 반응형 레이아웃 (모바일, 태블릿, 데스크톱)
  - 각 아이템: 썸네일, 제목, 작성자, 카테고리, 미리보기
- [ ] 매거진 아이템 컴포넌트
  - Card 컴포넌트로 구현
  - 호버 효과
  - 클릭하면 상세 페이지로 이동
- [ ] 필터 & 정렬 UI
  - 카테고리 필터 드롭다운
  - 정렬 옵션 (최신순, 인기순)
- [ ] 페이지네이션
  - 다음/이전 버튼 또는 페이지 번호
  - 페이지 변경 시 API 재호출

---

### Phase 4: 매거진 작성 페이지 (3-4일)

#### Backend - 파일 업로드 & 매거진 생성
- [ ] Multer 설정
  - 저장 경로: `uploads/images/`, `uploads/videos/`
  - 파일 크기 제한 (이미지: 5MB, 비디오: 50MB)
  - 허용 파일 형식: jpg, png, gif, mp4, webm 등
- [ ] 파일 업로드 API
  - Route: `POST /api/upload/image`
  - Route: `POST /api/upload/video`
  - Response: 파일 URL
  - 오류 처리: 파일 크기 초과, 형식 오류
- [ ] 매거진 생성 API
  - Route: `POST /api/magazines`
  - 필드: title, description, content, coverImage, category, tags
  - 인증 확인 (JWT 검증)
  - author 자동 설정 (로그인 사용자)
  - Response: 생성된 매거진 정보
- [ ] 매거진 수정 API
  - Route: `PUT /api/magazines/:id`
  - 작성자만 수정 가능
- [ ] 매거진 삭제 API
  - Route: `DELETE /api/magazines/:id`
  - 작성자만 삭제 가능
  - 관련 파일 삭제

#### Frontend - 작성 페이지
- [ ] 작성 페이지 구조
  - 헤더 (저장, 취소 버튼)
  - 제목 입력 필드
  - 설명 입력 필드
  - 썸네일 이미지 업로더
- [ ] React-Quill-New 에디터 통합
  - 기본 포맷팅 도구 (bold, italic, underline, link)
  - 헤더, 리스트, 블록쿼트
  - **이미지 업로드 기능**
    - 에디터 내에서 이미지 삽입
    - 파일 선택 시 자동 업로드
    - 업로드된 이미지를 에디터에 삽입
  - **비디오 임베드 기능**
    - 유튜브/비메오 URL 임베드
    - 또는 비디오 파일 업로드
- [ ] 카테고리 & 태그 선택
  - Dropdown/Select 컴포넌트
  - 다중 태그 입력 (Chip 컴포넌트)
- [ ] 폼 유효성 검사
  - 필수 필드 확인
  - 입력 길이 검사
- [ ] 저장 기능
  - API 호출 (POST /api/magazines)
  - 로딩 상태 표시
  - 성공/실패 토스트 메시지
  - 성공 후 메인 페이지로 리다이렉트

---

### Phase 5: 매거진 상세 페이지 (1-2일)

#### Backend - 상세 조회
- [ ] 매거진 상세 정보 조회 API (이미 구현)
- [ ] 작성자 정보 포함
- [ ] 댓글 조회 (선택사항)

#### Frontend - 상세 페이지
- [ ] 페이지 구조
  - 헤더 (제목, 작성자, 작성 날짜, 조회수)
  - 썸네일 이미지
  - 본문 콘텐츠 (HTML 렌더링)
  - 작성자 프로필 섹션
  - 좋아요 버튼
  - 댓글 섹션 (선택사항)
  - 관련 매거진 추천 (선택사항)
- [ ] HTML 콘텐츠 안전하게 렌더링
  - DOMPurify 사용 또는 `dangerouslySetInnerHTML` 대체
- [ ] 수정/삭제 버튼 (작성자만 표시)
- [ ] 공유 기능 (SNS 공유 버튼)
- [ ] 조회수 증가 (페이지 로드 시)

---

### Phase 6: 헤더 & 네비게이션 (1-2일)

- [ ] 헤더 컴포넌트 구현
  - 로고
  - 네비게이션 링크 (홈, 게시물, 카테고리)
  - 검색 기능 (선택사항)
  - 사용자 메뉴
    - 로그인 상태: 프로필, 내 글, 로그아웃
    - 비로그인 상태: 로그인, 회원가입
  - 반응형 메뉴 (모바일)
- [ ] 사이드바 네비게이션 (모바일)
  - 해버거 메뉴
  - 드로어 컴포넌트
- [ ] 푸터 구현
  - 회사 정보
  - 링크 (개인정보보호정책, 이용약관 등)
  - 소셜 미디어 링크

---

### Phase 7: 추가 기능 & 최적화 (2-3일)

#### Backend
- [ ] 에러 처리 개선
  - 400, 401, 403, 404, 500 에러 처리
- [ ] 입력 검증 (joi, express-validator)
- [ ] 데이터베이스 인덱싱
  - `author`, `category`, `publishedAt` 필드

#### Frontend
- [ ] 성능 최적화
  - 이미지 최적화 (next/image)
  - 코드 스플리팅
  - 레이지 로딩
- [ ] SEO 최적화
  - Meta 태그 (title, description, og:image)
  - next/head 또는 next-seo 사용
- [ ] 로딩 상태 UI
  - Skeleton 스크린
  - 스피너
- [ ] 에러 처리
  - 사용자 친화적 에러 메시지
  - 404 페이지
  - 500 페이지
- [ ] 다크 모드 지원 (선택사항)
  - MUI 테마 토글

---

### Phase 8: 테스트 & 배포 (2-3일)

#### 테스트
- [ ] API 테스트 (Postman 또는 Jest)
  - 인증 API
  - 매거진 CRUD API
  - 파일 업로드 API
- [ ] Frontend 유닛 테스트 (Jest + React Testing Library)
- [ ] E2E 테스트 (Cypress 선택사항)

#### 배포
- [ ] Backend 배포 (Heroku, Railway, Render, AWS 등)
  - 환경 변수 설정
  - MongoDB Atlas 클라우드 설정
  - 파일 저장소 구성 (선택사항: AWS S3, Cloudinary)
- [ ] Frontend 배포 (Vercel, Netlify 등)
  - Next.js 빌드 최적화
  - 환경 변수 설정
- [ ] HTTPS 설정
- [ ] 도메인 설정

---

## 📁 Git 리포지토리 구조

```
magazine-app/
├── server/                 # Express 백엔드
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── magazineController.js
│   │   └── uploadController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Magazine.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── magazineRoutes.js
│   │   └── uploadRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── uploads/            # 파일 저장 폴더
│   │   ├── images/
│   │   └── videos/
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── client/                 # Next.js 프론트엔드
    ├── pages/
    │   ├── index.js        # 메인 페이지
    │   ├── login.js        # 로그인
    │   ├── register.js     # 회원가입
    │   ├── create.js       # 작성 페이지
    │   └── [id].js         # 상세 페이지
    ├── components/
    │   ├── Header.js
    │   ├── Navigation.js
    │   ├── MagazineCard.js
    │   ├── MagazineGrid.js
    │   ├── Editor.js       # react-quill-new 에디터
    │   └── Footer.js
    ├── utils/
    │   ├── api.js          # Axios 인스턴스
    │   └── auth.js
    ├── hooks/
    │   └── useAuth.js
    ├── store/              # Redux 또는 Context
    │   └── authSlice.js
    ├── public/
    ├── styles/
    ├── .env.local
    ├── .gitignore
    ├── next.config.js
    └── package.json

.gitignore              # 루트 .gitignore
README.md
```

---

## 🔐 환경 변수 설정

### Server (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=5000
NODE_ENV=development

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800  # 50MB
```

### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 시작하기

### 1. 리포지토리 클론
```bash
git clone <repository-url>
cd magazine-app
```

### 2. Backend 설정
```bash
cd server
npm install
# .env 파일 생성 후 환경 변수 설정
npm run dev
```

### 3. Frontend 설정
```bash
cd client
npm install
# .env.local 파일 생성 후 환경 변수 설정
npm run dev
```

---

## 💡 개발 팁

1. **JWT 토큰 저장**
   - localStorage 대신 httpOnly 쿠키 사용 권장 (보안)
   - 또는 메모리에 저장 후 새로고침 시 리프레시 토큰으로 재발급

2. **파일 업로드**
   - 현재 로컬 저장소 사용 (향후 AWS S3 또는 Cloudinary 이동 권장)
   - 파일 크기 및 형식 검증 필수

3. **React-Quill-New**
   - 이미지 업로드 핸들러를 커스텀하여 백엔드로 전송
   - 서버에서 URL을 받아 에디터에 삽입

4. **SEO 최적화**
   - next-seo 라이브러리 사용
   - 메타 태그를 동적으로 설정
   - sitemap.xml, robots.txt 생성

5. **에러 처리**
   - 백엔드: 상세한 에러 코드 및 메시지 제공
   - 프론트엔드: 사용자 친화적인 메시지로 변환

---

## 📝 참고 메모: react-quill vs react-quill-new

> **react-quill-new 사용 권장**
>
> - **react-quill**은 유지보수가 중단되었으며, React 19를 지원하지 않습니다.
> - 기존 react-quill은 `ReactDOM.findDOMNode`를 사용하는데, 이 API가 React 19에서 완전히 제거되어 호환되지 않습니다.
> - **react-quill-new**는 react-quill의 포크로, 활발히 유지보수되며 React 16+, React 19를 지원합니다.
> - QuillJS 의존성을 1.3.7 → 2.0.2 이상으로 업데이트했고, 기존 react-quill 대부분의 사용 사례에서 드롭인 교체로 사용 가능합니다.

---

## 📞 참고 링크

- [React-Quill-New (npm)](https://www.npmjs.com/package/react-quill-new)
- [Quill 공식 문서](https://quilljs.com/)
- [MUI 공식 문서](https://mui.com/)
- [JWT 인증 가이드](https://jwt.io/)
- [MongoDB 공식 문서](https://docs.mongodb.com/)
- [Express.js 가이드](https://expressjs.com/)

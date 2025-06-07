## 1단계: 리액트 앱의 시작과 프로젝트 구조

### 1. 시작점: `index.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**이 코드가 하는 일:**
- `public/index.html`의 `<div id="root"></div>`를 찾습니다
- `App` 컴포넌트부터 시작하는 전체 리액트 앱을 이 div 안에 렌더링합니다
- `React.StrictMode`는 개발 중에 잠재적인 문제를 찾아내는데 도움을 줍니다

### 2. HTML 템플릿: `public/index.html`
```html
<body>
  <div id="root"></div>
</body>
```
- 이것이 리액트 앱이 사용하는 유일한 HTML 요소입니다
- 브라우저에서 보이는 모든 것은 이 `root` div 안에 리액트가 렌더링합니다

### 3. 최상위 컴포넌트: `App.tsx`
```tsx
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
```

**여기서 일어나는 일:**
- `ThemeProvider`와 `CssBaseline`은 Material-UI에서 가져온 것으로, 디자인 시스템을 설정하고 브라우저 CSS를 초기화합니다
- `AuthProvider`는 전체 앱에 인증 상태를 제공합니다
- `Router`는 클라이언트 사이드 네비게이션(싱글 페이지 앱)을 가능하게 합니다
- `AppRoutes`는 실제 페이지 라우트들을 포함합니다

### 4. 라우팅: `AppRoutes`
```tsx
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Routes>
      {user && (
        <>
          <Route path="/login" element={<Navigate to="/board" replace />} />
          <Route path="/register" element={<Navigate to="/board" replace />} />
        </>
      )}
      <Route path="/*" element={user ? <BoardRoutes /> : <AuthRoutes />} />
    </Routes>
  );
};
```

- 사용자가 로그인되어 있으면 `/login`과 `/register`에서 `/board`로 리다이렉션됩니다
- 로그인되어 있지 않으면 인증 라우트를 보여줍니다
- 인증 상태를 확인하는 동안 로딩 스피너를 보여줍니다

### 5. 프로젝트 구조 (`src/` 폴더)
- `index.tsx`: 진입점
- `App.tsx`: 최상위 컴포넌트
- `routes/`: 라우트 정의 (페이지들)
- `components/`: 재사용 가능한 UI 컴포넌트들
- `contexts/`: Context 제공자들 (인증 등)
- `api/`: 백엔드 API 호출
- `containers/`: 데이터 가져오기와 상태 관리 로직
- `hooks/`: 커스텀 리액트 훅들
- `theme.ts`: Material-UI 테마 설정

### 요약
- 브라우저는 `<div id="root"></div>` 하나만 있는 `index.html`을 로드합니다
- `index.tsx`는 리액트 앱을 그 div 안에 렌더링합니다
- `App.tsx`는 전역 제공자들(테마, 인증, 라우터)을 설정합니다
- 라우팅과 페이지 로직은 `AppRoutes`와 `routes/` 폴더에서 처리됩니다
- 모든 UI는 `components/` 폴더의 컴포넌트들로 구성됩니다

다음으로 어떤 부분에 대해 더 자세히 알아보고 싶으신가요?
1. 라우팅 시스템
2. Context API와 상태 관리
3. 컴포넌트 구조
4. Material-UI 스타일링

선택해주시면 해당 부분에 대해 더 자세히 설명드리겠습니다!

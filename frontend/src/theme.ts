import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // 1. 색상 팔레트 설정
  palette: {
    mode: 'light',  // 라이트 모드 사용
    primary: {
      main: '#1976d2',  // 기본 파란색
      light: '#42a5f5', // 밝은 파란색
      dark: '#1565c0',  // 어두운 파란색
    },
    secondary: {
      main: '#9c27b0',  // 기본 보라색
      light: '#ba68c8', // 밝은 보라색
      dark: '#7b1fa2',  // 어두운 보라색
    },
    background: {
      default: '#f5f5f5', // 기본 배경색 (연한 회색)
      paper: '#ffffff',   // Paper 컴포넌트 배경색 (흰색)
    },
    text: {
      primary: '#212121', // 기본 텍스트 색상 (거의 검은색)
      secondary: '#757575', // 보조 텍스트 색상 (회색)
    },
  },

  // 2. 타이포그래피 설정
  typography: {
    fontFamily: [
      '-apple-system',    // macOS/iOS 시스템 폰트
      'BlinkMacSystemFont', // macOS/iOS 시스템 폰트
      '"Segoe UI"',       // Windows 시스템 폰트
      'Roboto',           // Google의 기본 폰트
      '"Helvetica Neue"', // macOS/iOS 시스템 폰트
      'Arial',            // 기본 폰트
      'sans-serif',       // 산세리프 폰트
    ].join(','),         // 여러 폰트를 순서대로 시도
  },

  // 3. 컴포넌트 스타일 오버라이드
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Paper 컴포넌트의 기본 그라데이션 배경 제거
        },
      },
    },
  },
});

export default theme;
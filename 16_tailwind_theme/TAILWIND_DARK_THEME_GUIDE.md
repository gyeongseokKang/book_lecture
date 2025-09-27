# Tailwind CSS Dark Theme 완벽 마스터 가이드

React + TypeScript 환경에서 Tailwind CSS를 활용한 다크 테마 구현 완벽 가이드입니다.

## 📋 목차

1. [Tailwind 셋팅하는 법](#1-tailwind-셋팅하는-법)
2. [Dark Theme 셋팅하는 법](#2-dark-theme-셋팅하는-법)
3. [테마를 다루는 React Context 방법](#3-테마를-다루는-react-context-방법)
4. [LocalStorage에 저장하는 법](#4-localstorage에-저장하는-법)
5. [Dark Theme 시 스타일상 조심해야할 점](#5-dark-theme-시-스타일상-조심해야할-점)

---

## 1. Tailwind 셋팅하는 법

### 패키지 설치

```bash
# 기존 프로젝트에 Tailwind 추가
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 또는 새 Vite 프로젝트 생성 시
npm create vite@latest my-project -- --template react-ts
cd my-project
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.js 설정

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // 🔑 핵심 포인트!
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### CSS 초기화 (src/index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 기존 CSS 스타일 제거 후 위 3줄만 남겨두기 */
```

### 기본 설정 확인

```typescript
// src/App.tsx - 테스트용 코드
function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold p-8">Tailwind Dark Theme Test</h1>
    </div>
  );
}
```

---

## 2. Dark Theme 셋팅하는 법

### 기본 다크모드 클래스 사용법

```typescript
// 배경색과 텍스트 색상
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">제목</h1>
  <p className="text-gray-600 dark:text-gray-300">본문 텍스트</p>
</div>

// 버튼 스타일링
<button className="
  bg-blue-500 hover:bg-blue-600
  dark:bg-blue-600 dark:hover:bg-blue-700
  text-white px-4 py-2 rounded-lg
  transition-colors duration-200
">
  버튼
</button>

// 카드 컴포넌트
<div className="
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-lg p-6 shadow-lg dark:shadow-gray-800/25
">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    카드 제목
  </h3>
</div>
```

### 시스템 테마 감지

```typescript
// utils/theme.ts
export const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    // 1. localStorage에서 저장된 테마 확인
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    // 2. 시스템 테마 확인
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};
```

### DOM 클래스 조작

```typescript
// 다크모드 활성화
document.documentElement.classList.add("dark");

// 다크모드 비활성화
document.documentElement.classList.remove("dark");

// 토글
document.documentElement.classList.toggle("dark");
```

---

## 3. 테마를 다루는 React Context 방법

### ThemeContext 생성

```typescript
// src/contexts/ThemeContext.tsx
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    // SSR 환경 고려
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // DOM 클래스 업데이트
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // 초기 DOM 클래스 설정
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // localStorage에 저장된 테마가 없을 때만 시스템 테마 따라가기
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 커스텀 훅
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

### App.tsx에서 Provider 설정

```typescript
// src/App.tsx
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My App
            </h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="p-8">{/* 앱 콘텐츠 */}</main>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### ThemeToggle 컴포넌트

```typescript
// src/components/ThemeToggle.tsx
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg transition-colors duration-200
        bg-gray-200 hover:bg-gray-300 
        dark:bg-gray-700 dark:hover:bg-gray-600
        text-gray-800 dark:text-gray-200
      "
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
```

---

## 4. LocalStorage에 저장하는 법

### 안전한 LocalStorage 유틸리티

```typescript
// src/utils/storage.ts
export const THEME_STORAGE_KEY = "app-theme";

export const saveThemeToStorage = (theme: "light" | "dark"): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
};

export const getThemeFromStorage = (): "light" | "dark" | null => {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === "light" || theme === "dark" ? theme : null;
  } catch (error) {
    console.warn("Failed to get theme from localStorage:", error);
    return null;
  }
};

export const removeThemeFromStorage = (): void => {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to remove theme from localStorage:", error);
  }
};
```

### 고급 테마 관리 훅

```typescript
// src/hooks/useThemeStorage.ts
import { useState, useEffect, useCallback } from "react";
import { saveThemeToStorage, getThemeFromStorage } from "../utils/storage";

export const useThemeStorage = () => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    // SSR 환경에서는 기본값 반환
    if (typeof window === "undefined") return "light";

    // 1. localStorage 확인
    const savedTheme = getThemeFromStorage();
    if (savedTheme) return savedTheme;

    // 2. 시스템 테마 확인
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    saveThemeToStorage(newTheme);

    // DOM 업데이트
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // 초기 DOM 설정
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 사용자가 수동으로 설정한 테마가 없을 때만 시스템 테마 따라가기
      const savedTheme = getThemeFromStorage();
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
};
```

### 테마 동기화 (여러 탭 간)

```typescript
// src/hooks/useThemeSync.ts
import { useEffect } from "react";
import { THEME_STORAGE_KEY } from "../utils/storage";

export const useThemeSync = (
  currentTheme: "light" | "dark",
  setTheme: (theme: "light" | "dark") => void
) => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as "light" | "dark";
        if (
          newTheme !== currentTheme &&
          (newTheme === "light" || newTheme === "dark")
        ) {
          setTheme(newTheme);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentTheme, setTheme]);
};
```

---

## 5. Dark Theme 시 스타일상 조심해야할 점

### 🎨 색상 대비 (Contrast) 주의사항

```typescript
// ❌ 나쁜 예 - 대비가 부족해서 가독성이 떨어짐
<div className="bg-gray-100 dark:bg-gray-800">
  <p className="text-gray-400 dark:text-gray-600">읽기 어려운 텍스트</p>
</div>

// ✅ 좋은 예 - 충분한 대비로 가독성 확보
<div className="bg-gray-50 dark:bg-gray-900">
  <p className="text-gray-700 dark:text-gray-300">읽기 쉬운 텍스트</p>
  <h2 className="text-gray-900 dark:text-white">명확한 제목</h2>
</div>

// 📊 대비 비율 가이드라인 (WCAG 기준)
// - 일반 텍스트: 최소 4.5:1
// - 큰 텍스트 (18px+ 또는 14px+ bold): 최소 3:1
// - UI 요소: 최소 3:1
```

### 🖼️ 이미지 & 아이콘 처리

```typescript
// 테마별 다른 이미지 사용
const Logo = () => {
  const { theme } = useTheme()

  return (
    <img
      src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
      alt="로고"
      className="h-8 w-auto"
    />
  )
}

// CSS filter를 활용한 아이콘 색상 변경
<img
  src="/icon.png"
  className="
    w-6 h-6
    dark:invert dark:brightness-0 dark:contrast-200
  "
  alt="아이콘"
/>

// SVG 아이콘의 경우 fill 속성 활용
<svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor">
  <path d="..." />
</svg>
```

### 🎯 그림자 & 테두리

```typescript
// ❌ 다크모드에서 보이지 않는 그림자
<div className="shadow-lg bg-white">
  콘텐츠
</div>

// ✅ 테마별 적절한 그림자
<div className="
  bg-white dark:bg-gray-800
  shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
  border border-gray-200 dark:border-gray-700
">
  콘텐츠
</div>

// 그림자 색상 커스터마이징
<div className="
  shadow-xl
  shadow-blue-500/10 dark:shadow-blue-400/20
">
  강조된 카드
</div>
```

### ⚡ 성능 최적화

```typescript
// CSS 변수 활용으로 리렌더링 최소화
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      }
    }
  }
}

// src/index.css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-background: #ffffff;
  --color-foreground: #111827;
}

.dark {
  --color-primary: #60a5fa;
  --color-secondary: #9ca3af;
  --color-background: #111827;
  --color-foreground: #f9fafb;
}

// 사용 예시
<div className="bg-background text-foreground">
  <button className="bg-primary hover:bg-primary/90">
    버튼
  </button>
</div>
```

### 📱 접근성 (Accessibility) 고려사항

```typescript
// 애니메이션 감소 설정 존중
<div className="
  transition-colors duration-200
  motion-reduce:transition-none
">
  콘텐츠
</div>

// 포커스 상태 명확히 표시
<button className="
  px-4 py-2 rounded-lg
  bg-blue-500 hover:bg-blue-600
  dark:bg-blue-600 dark:hover:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900
">
  접근 가능한 버튼
</button>

// 색상에만 의존하지 않는 정보 전달
<div className="flex items-center space-x-2">
  <div className="
    w-3 h-3 rounded-full
    bg-green-500 dark:bg-green-400
  "></div>
  <span className="text-sm text-gray-600 dark:text-gray-300">
    온라인 (색상 + 텍스트로 상태 표시)
  </span>
</div>
```

### 🔧 디버깅 & 테스팅 팁

```typescript
// 개발 환경에서 테마 상태 확인
const ThemeDebugger = () => {
  const { theme } = useTheme();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-black/80 text-white text-xs rounded">
      Theme: {theme}
      <br />
      DOM Class:{" "}
      {document.documentElement.classList.contains("dark") ? "dark" : "light"}
    </div>
  );
};

// 테마 전환 테스트 헬퍼
const useThemeTest = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "t") {
        setTheme(
          document.documentElement.classList.contains("dark") ? "light" : "dark"
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setTheme]);
};
```

### 🎨 고급 테마 커스터마이징

```typescript
// 다중 테마 지원
type Theme = 'light' | 'dark' | 'auto'

// 브랜드 컬러 테마별 정의
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        'brand-dark': {
          50: '#1e3a8a',
          500: '#60a5fa',
          900: '#eff6ff',
        }
      }
    }
  }
}

// 사용 시
<div className="bg-brand-50 dark:bg-brand-dark-50">
  테마별 브랜드 컬러
</div>
```

---

## 🚀 실전 예제: 완성된 컴포넌트

### Card 컴포넌트

```typescript
// src/components/Card.tsx
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

const Card = ({ title, description, children, className = "" }: CardProps) => {
  return (
    <div
      className={`
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-xl p-6 shadow-lg dark:shadow-gray-900/25
      transition-colors duration-200
      ${className}
    `}
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      {children}
    </div>
  );
};

export default Card;
```

### Input 컴포넌트

```typescript
// src/components/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:focus:ring-blue-400
          transition-colors duration-200
          ${error ? "border-red-500 dark:border-red-400" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
```

---

## 📚 추가 리소스

- [Tailwind CSS Dark Mode 공식 문서](https://tailwindcss.com/docs/dark-mode)
- [WCAG 색상 대비 가이드라인](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [prefers-color-scheme MDN 문서](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

## 🎯 체크리스트

- [ ] Tailwind CSS 설치 및 설정 완료
- [ ] `darkMode: 'class'` 설정 확인
- [ ] ThemeProvider 구현 및 적용
- [ ] localStorage 테마 저장/복원 기능
- [ ] 시스템 테마 감지 기능
- [ ] 색상 대비 검증 (최소 4.5:1)
- [ ] 포커스 상태 스타일링
- [ ] 애니메이션 감소 설정 적용
- [ ] 크로스 브라우저 테스트
- [ ] 접근성 검증 완료

이 가이드를 따라하면 완벽한 다크 테마 시스템을 구축할 수 있습니다! 🌙✨

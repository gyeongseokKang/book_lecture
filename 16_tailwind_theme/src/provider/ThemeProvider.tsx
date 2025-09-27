import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useThemeSync } from "../hooks/useThemeSync";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    // SSR 환경 고려
    if (typeof window === "undefined") return "light";

    // localStorage에 저장된 테마 확인
    const savedTheme = localStorage.getItem("project_name_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setThemeState(newTheme);

    // DOM 클래스 업데이트
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // localStorage에 저장
    localStorage.setItem("project_name_theme", newTheme);
  }, []);

  // 탭 간 테마 동기화 훅 사용
  const { markAsLocalChange } = useThemeSync(theme, setTheme);

  const toggleTheme = useCallback(() => {
    // 현재 탭에서 테마를 변경한다고 표시
    markAsLocalChange();
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme, markAsLocalChange]);

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
      // 저장된 테마가 없을 때만 시스템 테마 변경에 반응
      const savedTheme = localStorage.getItem("project_name_theme");
      if (!savedTheme) {
        markAsLocalChange();
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setTheme, markAsLocalChange]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

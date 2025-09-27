import { useEffect, useRef } from "react";

/**
 * 탭 간 테마 동기화를 위한 훅
 * localStorage의 변경을 감지하여 다른 탭에서 테마가 변경될 때 현재 탭의 테마도 동기화
 */
export const useThemeSync = (
  currentTheme: "light" | "dark",
  setTheme: (theme: "light" | "dark") => void
) => {
  // 현재 탭에서 테마를 변경했는지 추적하는 ref
  const isLocalChange = useRef(false);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // project_name_theme 키에 대한 변경만 처리
      if (e.key === "project_name_theme" && e.newValue) {
        const newTheme = e.newValue as "light" | "dark";

        // 유효한 테마 값인지 검증
        if (newTheme !== "light" && newTheme !== "dark") {
          console.warn(`Invalid theme value: ${newTheme}`);
          return;
        }

        // 현재 테마와 다르고, 현재 탭에서 변경한 것이 아닌 경우에만 동기화
        if (newTheme !== currentTheme && !isLocalChange.current) {
          console.log(
            `Theme synced from another tab: ${currentTheme} → ${newTheme}`
          );
          setTheme(newTheme);
        }

        // 로컬 변경 플래그 리셋
        isLocalChange.current = false;
      }
    };

    // storage 이벤트는 같은 탭에서는 발생하지 않고, 다른 탭에서만 발생
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentTheme, setTheme]);

  // 현재 탭에서 테마 변경 시 호출할 함수
  const markAsLocalChange = () => {
    isLocalChange.current = true;
  };

  return { markAsLocalChange };
};

// useWindowSize.ts
import { useEffect, useState } from "react";

type WindowSize = { width: number; height: number };

export default function useWindowSize(): {
  size: WindowSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const isBrowser = typeof window !== "undefined";

  const [size, setSize] = useState<WindowSize>(() => ({
    width: isBrowser ? window.innerWidth : 0,
    height: isBrowser ? window.innerHeight : 0,
  }));

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;

    let rafId = 0;

    const update = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    // 초기 1회 동기화 (SSR 후 클라이언트에서 보정)
    onResize();

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [isBrowser]);

  return {
    size,
    isMobile,
    isTablet,
    isDesktop,
  };
}

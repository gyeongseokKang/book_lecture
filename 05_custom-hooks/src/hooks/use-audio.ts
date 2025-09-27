// useAudio.ts (Step 1: 최소 동작)
import * as React from "react";

type AudioState = {
  /** 재생 중인지 여부 */
  playing: boolean;
  /** 현재 재생 위치 (초) */
  current: number;
  duration: number;
  muted: boolean;
  volume: number;
};

type AudioOptions = {
  autoPlay?: boolean;
  onEnd?: () => void;
};

type AudioControls = {
  play: () => Promise<void> | void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  mute: () => void;
  unmute: () => void;
};

export function useAudio(src: string, opts?: AudioOptions) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [state, setState] = React.useState<AudioState>({
    playing: false,
    current: 0,
    duration: 0,
    muted: false,
    volume: 1,
  });

  // 오디오 인스턴스 생성 & 이벤트 바인딩
  React.useEffect(() => {
    const el = new Audio(src);
    audioRef.current = el;

    const onLoaded = () =>
      setState((s) => ({
        ...s,
        duration: el.duration || 0,
        volume: el.volume,
        muted: el.muted,
      }));
    const onTime = () => setState((s) => ({ ...s, current: el.currentTime }));
    const onPlay = () => setState((s) => ({ ...s, playing: true }));
    const onPause = () => setState((s) => ({ ...s, playing: false }));
    const onEnded = () => {
      setState((s) => ({ ...s, playing: false, current: 0 }));
      opts?.onEnd?.();
    };
    const onVolume = () =>
      setState((s) => ({ ...s, volume: el.volume, muted: el.muted }));

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("volumechange", onVolume);

    if (opts?.autoPlay) {
      // 자동재생은 브라우저 정책에 따라 막힐 수 있음
      el.play().catch(() => {});
    }

    return () => {
      el.pause();
      el.src = "";
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("volumechange", onVolume);
    };
  }, [src]);

  // 컨트롤
  const play = React.useCallback(() => audioRef.current?.play(), []);
  const pause = React.useCallback(() => audioRef.current?.pause(), []);
  const seek = React.useCallback(
    (t: number) => {
      const el = audioRef.current;
      if (!el) return;
      const safe = Math.min(Math.max(0, t), state.duration || 0);
      el.currentTime = safe;
      setState((s) => ({ ...s, current: safe }));
    },
    [state.duration]
  );
  const setVolume = React.useCallback((v: number) => {
    const el = audioRef.current;
    if (!el) return;
    const safe = Math.min(1, Math.max(0, v));
    el.volume = safe;
    setState((s) => ({ ...s, volume: safe }));
  }, []);

  const mute = React.useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = true;
    setState((s) => ({ ...s, muted: true }));
  }, []);

  const unmute = React.useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = false;
    setState((s) => ({ ...s, muted: false }));
  }, []);

  const controls: AudioControls = {
    play,
    pause,
    seek,
    setVolume,
    mute,
    unmute,
  };
  return { state, controls };
}

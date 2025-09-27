import "./App.css";
import audio from "./assets/내손을잡아.mp3";
import { useAudio } from "./hooks/use-audio";
import useWindowSize from "./hooks/use-window-size";

function App() {
  return (
    <div className="app-container">
      <div className="app-main">
        <header className="app-header">
          <h1 className="app-title">🎯 Custom Hooks Demo</h1>
          <p className="app-description">
            실용적인 커스텀 훅들의 실제 동작을 확인해보세요
          </p>
        </header>
        <UseAudioDemo />
        <UseWindowSizeDemo />
      </div>
    </div>
  );
}

export default App;

const UseAudioDemo = () => {
  const { state, controls } = useAudio(audio);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h2 className="demo-title">🎵 useAudio Hook</h2>
        <p className="demo-description">
          HTML5 Audio API를 래핑한 커스텀 훅으로, 오디오 재생, 일시정지, 탐색,
          볼륨 조절 등의 기능을 제공합니다. React의 생명주기와 연동되어 메모리
          누수 없이 안전하게 오디오를 제어할 수 있습니다.
        </p>
      </div>

      {/* 메인 컨트롤 버튼들 */}
      <div className="audio-controls">
        <button
          onClick={() => controls.play()}
          className={`audio-btn ${
            state.playing ? "audio-btn-play" : "audio-btn-play"
          }`}
          disabled={state.playing}
        >
          ▶️ 재생
        </button>

        <button
          onClick={() => controls.pause()}
          className={`audio-btn ${
            !state.playing ? "audio-btn-pause" : "audio-btn-pause"
          }`}
          disabled={!state.playing}
        >
          ⏸️ 정지
        </button>

        <button
          onClick={() => controls.seek(state.current - 5)}
          className="audio-btn audio-btn-seek"
        >
          ⏪ -5초
        </button>

        <button
          onClick={() => controls.seek(state.current + 5)}
          className="audio-btn audio-btn-seek"
        >
          ⏩ +5초
        </button>
      </div>

      {/* 진행 바 */}
      <div className="progress-container">
        <div className="progress-info">
          <span>{formatTime(state.current)}</span>
          <span
            className={`progress-status ${
              state.playing
                ? "progress-status-playing"
                : "progress-status-paused"
            }`}
          >
            {state.playing ? "▶ 재생중" : "⏸ 정지"}
          </span>
          <span>{formatTime(state.duration)}</span>
        </div>

        <input
          type="range"
          min={0}
          max={state.duration || 0}
          step={1}
          value={state.current}
          onChange={(e) => controls.seek(Number(e.target.value))}
          className="progress-bar"
        />
      </div>

      {/* 볼륨 컨트롤 */}
      <div className="volume-controls">
        <button
          onClick={() => (state.muted ? controls.unmute() : controls.mute())}
          className={`volume-btn ${
            state.muted ? "volume-btn-muted" : "volume-btn-unmuted"
          }`}
        >
          {state.muted ? "🔇" : "🔊"}
        </button>

        <div className="volume-slider-container">
          <span className="volume-label volume-label-min">0%</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.volume}
            onChange={(e) => controls.setVolume(Number(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-label volume-label-max">
            {Math.round(state.volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

const UseWindowSizeDemo = () => {
  const { size, isMobile, isTablet, isDesktop } = useWindowSize();

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h2 className="demo-title">📏 useWindowSize Hook</h2>
        <p className="demo-description">
          브라우저 창의 크기 변화를 실시간으로 감지하는 커스텀 훅입니다.
          리사이즈 이벤트를 requestAnimationFrame으로 최적화하여 성능을
          향상시키고, 반응형 웹 디자인에서 유용하게 사용할 수 있습니다.
        </p>
      </div>

      {/* 현재 화면 크기 표시 */}
      <div className="size-grid">
        <div className="size-card size-card-width">
          <div className="size-icon">📐</div>
          <div className="size-label">너비</div>
          <div className="size-value">{size.width}px</div>
        </div>

        <div className="size-card size-card-height">
          <div className="size-icon">📏</div>
          <div className="size-label">높이</div>
          <div className="size-value">{size.height}px</div>
        </div>
      </div>

      {/* 브레이크포인트 가이드 */}
      <div className="breakpoint-guide">
        <h3 className="breakpoint-title">📱 반응형 브레이크포인트</h3>
        <div className="breakpoint-grid">
          <div
            className={`breakpoint-item ${
              isMobile ? "breakpoint-mobile" : "breakpoint-inactive"
            }`}
          >
            📱 모바일 (&lt; 768px)
          </div>
          <div className={`breakpoint-item ${isTablet && "breakpoint-tablet"}`}>
            📱 태블릿 (768px - 1024px)
          </div>
          <div
            className={`breakpoint-item ${isDesktop && "breakpoint-desktop"}`}
          >
            💻 데스크톱 (≥ 1024px)
          </div>
        </div>
      </div>
    </div>
  );
};

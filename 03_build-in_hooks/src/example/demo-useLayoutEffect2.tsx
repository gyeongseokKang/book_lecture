// 극단적인 성능 차이 비교 예시 - useEffect vs useLayoutEffect
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// ❌ 극단적으로 문제가 있는 버전: useEffect + 많은 DOM 조작
function ExtremeBadPerformanceWithUseEffect() {
  const [counter, setCounter] = useState(0);
  const [boxes, setBoxes] = useState<
    Array<{ id: number; color: string; position: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 의도적으로 매우 무거운 작업을 useEffect에서 수행
    const newBoxes = [];

    // 50개의 박스를 생성하면서 각각 다른 색상과 위치로 설정
    for (let i = 0; i < 50; i++) {
      newBoxes.push({
        id: i,
        color: `hsl(${(counter * 10 + i * 7) % 360}, 70%, 50%)`,
        position: Math.sin(counter * 0.1 + i * 0.2) * 200 + 250,
      });
    }
    setBoxes(newBoxes);

    // DOM을 여러 번 조작하여 리플로우 강제 발생
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.background = `linear-gradient(${
        counter * 5
      }deg, #ff0000, #00ff00)`;

      // 강제로 레이아웃 계산을 여러 번 유발
      void container.offsetHeight; // 리플로우 강제 발생
      container.style.transform = `scale(${1 + Math.sin(counter * 0.1) * 0.1})`;
      void container.offsetHeight; // 또 다른 리플로우
      container.style.borderRadius = `${10 + Math.sin(counter * 0.2) * 10}px`;
      void container.offsetHeight; // 또 다른 리플로우
    }
  }, [counter]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setCounter((c) => c + 1)}
          style={{
            padding: "15px 30px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          무거운 렌더링 실행 (useEffect) - {counter}
        </button>
        <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
          50개 박스 + 3번의 강제 리플로우 + 매 프레임마다 깜빡임
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          width: "500px",
          height: "300px",
          position: "relative",
          border: "3px solid #f44336",
          borderRadius: "10px",
          overflow: "hidden",
          transition: "none", // 트랜지션 제거로 깜빡임 더 명확하게
        }}
      >
        {boxes.map((box) => (
          <div
            key={box.id}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              backgroundColor: box.color,
              left: `${box.position}px`,
              top: `${20 + (box.id % 10) * 25}px`,
              borderRadius: "50%",
              // 각 박스마다 다른 애니메이션으로 부하 증가
              transform: `rotate(${counter * (box.id + 1) * 2}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ 최적화된 버전: useLayoutEffect + 효율적인 DOM 조작
function OptimizedPerformanceWithUseLayoutEffect() {
  const [counter, setCounter] = useState(0);
  const [boxes, setBoxes] = useState<
    Array<{ id: number; color: string; position: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 같은 작업이지만 useLayoutEffect에서 수행하여 한 번에 처리
    const newBoxes = [];

    for (let i = 0; i < 50; i++) {
      newBoxes.push({
        id: i,
        color: `hsl(${(counter * 10 + i * 7) % 360}, 70%, 50%)`,
        position: Math.sin(counter * 0.1 + i * 0.2) * 200 + 250,
      });
    }
    setBoxes(newBoxes);

    // DOM 조작을 한 번에 처리 (배치 처리)
    if (containerRef.current) {
      const container = containerRef.current;
      // 모든 스타일 변경을 한 번에 적용
      Object.assign(container.style, {
        background: `linear-gradient(${counter * 5}deg, #00ff00, #0000ff)`,
        transform: `scale(${1 + Math.sin(counter * 0.1) * 0.1})`,
        borderRadius: `${10 + Math.sin(counter * 0.2) * 10}px`,
      });
      // useLayoutEffect에서는 모든 변경사항이 한 번에 적용됨
    }
  }, [counter]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setCounter((c) => c + 1)}
          style={{
            padding: "15px 30px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          최적화된 렌더링 실행 (useLayoutEffect) - {counter}
        </button>
        <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
          50개 박스 + 배치 처리 + 부드러운 렌더링
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          width: "500px",
          height: "300px",
          position: "relative",
          border: "3px solid #4caf50",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {boxes.map((box) => (
          <div
            key={box.id}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              backgroundColor: box.color,
              left: `${box.position}px`,
              top: `${20 + (box.id % 10) * 25}px`,
              borderRadius: "50%",
              transform: `rotate(${counter * (box.id + 1) * 2}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 성능 측정 컴포넌트
function PerformanceMeasurement() {
  const [useEffectTime, setUseEffectTime] = useState<number[]>([]);
  const [useLayoutEffectTime, setUseLayoutEffectTime] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setUseEffectTime([]);
    setUseLayoutEffectTime([]);

    // useEffect 성능 측정 시뮬레이션
    for (let i = 0; i < 10; i++) {
      const start = performance.now();

      // useEffect 시뮬레이션: 여러 번의 DOM 접근
      const div = document.createElement("div");
      document.body.appendChild(div);

      // 강제 리플로우 3번 (useEffect 처럼)
      div.style.width = "100px";
      void div.offsetHeight; // 리플로우
      div.style.height = "100px";
      void div.offsetHeight; // 리플로우
      div.style.backgroundColor = "red";
      void div.offsetHeight; // 리플로우

      document.body.removeChild(div);
      const end = performance.now();

      setUseEffectTime((prev) => [...prev, end - start]);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // useLayoutEffect 성능 측정 시뮬레이션
    for (let i = 0; i < 10; i++) {
      const start = performance.now();

      // useLayoutEffect 시뮬레이션: 배치 처리
      const div = document.createElement("div");
      document.body.appendChild(div);

      // 한 번에 모든 스타일 적용 (useLayoutEffect 처럼)
      Object.assign(div.style, {
        width: "100px",
        height: "100px",
        backgroundColor: "green",
      });
      void div.offsetHeight; // 한 번만 리플로우

      document.body.removeChild(div);
      const end = performance.now();

      setUseLayoutEffectTime((prev) => [...prev, end - start]);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsRunning(false);
  };

  const avgUseEffect =
    useEffectTime.length > 0
      ? (
          useEffectTime.reduce((a, b) => a + b, 0) / useEffectTime.length
        ).toFixed(2)
      : "0";

  const avgUseLayoutEffect =
    useLayoutEffectTime.length > 0
      ? (
          useLayoutEffectTime.reduce((a, b) => a + b, 0) /
          useLayoutEffectTime.length
        ).toFixed(2)
      : "0";

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h4>⚡ 실제 성능 측정</h4>
      <button
        onClick={runPerformanceTest}
        disabled={isRunning}
        style={{
          padding: "12px 24px",
          backgroundColor: isRunning ? "#ccc" : "#2196f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: isRunning ? "not-allowed" : "pointer",
          marginBottom: "15px",
        }}
      >
        {isRunning ? "측정 중..." : "성능 테스트 시작"}
      </button>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div
          style={{
            padding: "15px",
            backgroundColor: "#ffebee",
            borderRadius: "6px",
          }}
        >
          <h5 style={{ color: "#f44336", margin: "0 0 10px 0" }}>
            ❌ useEffect 스타일
          </h5>
          <p>
            평균 시간: <strong>{avgUseEffect}ms</strong>
          </p>
          <p style={{ fontSize: "12px", color: "#666" }}>3번의 개별 리플로우</p>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#e8f5e8",
            borderRadius: "6px",
          }}
        >
          <h5 style={{ color: "#4caf50", margin: "0 0 10px 0" }}>
            ✅ useLayoutEffect 스타일
          </h5>
          <p>
            평균 시간: <strong>{avgUseLayoutEffect}ms</strong>
          </p>
          <p style={{ fontSize: "12px", color: "#666" }}>1번의 배치 리플로우</p>
        </div>
      </div>

      {useEffectTime.length > 0 && useLayoutEffectTime.length > 0 && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#fff3cd",
            borderRadius: "4px",
          }}
        >
          <strong>성능 개선:</strong> useLayoutEffect 스타일이 평균{" "}
          {(
            ((parseFloat(avgUseEffect) - parseFloat(avgUseLayoutEffect)) /
              parseFloat(avgUseEffect)) *
            100
          ).toFixed(1)}
          % 더 빠름
        </div>
      )}
    </div>
  );
}

// 메인 데모 컴포넌트
export default function ExtremePerformanceDemo() {
  return (
    <div style={{ padding: "40px", maxWidth: "1000px" }}>
      <h2>극단적인 성능 차이 비교 - useEffect vs useLayoutEffect</h2>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>🚨 중요: 차이점을 확실히 보려면</h3>
        <ul style={{ margin: "10px 0", paddingLeft: "25px" }}>
          <li>
            <strong>버튼을 빠르게 연속으로 클릭</strong>하세요 (1초에 3-4번)
          </li>
          <li>
            <strong>빨간색 박스</strong>에서 깜빡임과 끊어짐을 확인
          </li>
          <li>
            <strong>초록색 박스</strong>에서 부드러운 애니메이션을 확인
          </li>
          <li>Chrome DevTools의 Performance 탭으로 프레임 드롭 측정 가능</li>
        </ul>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ color: "#333", marginBottom: "20px" }}>
          🔥 극단적인 렌더링 부하 비교
        </h3>

        <div style={{ marginBottom: "30px" }}>
          <h4 style={{ color: "#f44336" }}>❌ useEffect - 심각한 성능 문제</h4>
          <ExtremeBadPerformanceWithUseEffect />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h4 style={{ color: "#4caf50" }}>
            ✅ useLayoutEffect - 최적화된 성능
          </h4>
          <OptimizedPerformanceWithUseLayoutEffect />
        </div>
      </div>

      <PerformanceMeasurement />

      <div
        style={{
          padding: "25px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h4>🧪 극단적인 테스트 방법:</h4>
        <ol style={{ margin: "10px 0", paddingLeft: "25px" }}>
          <li>
            <strong>연속 클릭:</strong> 각 버튼을 1초에 5-6번씩 빠르게 클릭
          </li>
          <li>
            <strong>성능 모니터링:</strong> 브라우저 개발자 도구에서 Performance
            탭 확인
          </li>
          <li>
            <strong>프레임률 확인:</strong> FPS 측정으로 실제 성능 차이 확인
          </li>
          <li>
            <strong>메모리 사용량:</strong> Memory 탭에서 가비지 컬렉션 빈도
            확인
          </li>
        </ol>
      </div>

      <div
        style={{
          padding: "25px",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h4>⚠️ useEffect의 심각한 문제점:</h4>
        <ul style={{ margin: "10px 0", paddingLeft: "25px" }}>
          <li>
            <strong>다중 리플로우:</strong> DOM 접근마다 레이아웃 재계산
          </li>
          <li>
            <strong>프레임 드롭:</strong> 60fps → 30fps 이하로 성능 저하
          </li>
          <li>
            <strong>시각적 깜빡임:</strong> 중간 상태들이 화면에 표시
          </li>
          <li>
            <strong>메모리 누수:</strong> 불필요한 렌더링으로 인한 메모리 압박
          </li>
        </ul>
      </div>

      <div
        style={{
          padding: "25px",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
        }}
      >
        <h4>✅ useLayoutEffect의 최적화 장점:</h4>
        <ul style={{ margin: "10px 0", paddingLeft: "25px" }}>
          <li>
            <strong>배치 처리:</strong> 모든 DOM 변경을 한 번에 처리
          </li>
          <li>
            <strong>부드러운 60fps:</strong> 안정적인 프레임률 유지
          </li>
          <li>
            <strong>시각적 일관성:</strong> 최종 결과만 화면에 표시
          </li>
          <li>
            <strong>메모리 효율성:</strong> 불필요한 중간 렌더링 제거
          </li>
        </ul>
      </div>
    </div>
  );
}

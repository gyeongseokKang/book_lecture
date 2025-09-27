import { useState } from "react";
import "./App.css";
import FormDemo from "./example/demo-useImperativeHandle";
import AutoResizeTextareaDemo from "./example/demo-useLayoutEffect";
import ExtremePerformanceDemo from "./example/demo-useLayoutEffect2";
import UseTransitionDemo from "./example/demo-useTransition";

function App() {
  const [activeDemo, setActiveDemo] = useState<
    "textarea" | "performance" | "transition" | "form"
  >("textarea");

  const demos = [
    {
      key: "transition" as const,
      label: "useTransition",
      component: <UseTransitionDemo />,
    },
    {
      key: "textarea" as const,
      label: "useLayoutEffect",
      component: <AutoResizeTextareaDemo />,
    },
    {
      key: "performance" as const,
      label: "useLayoutEffect(2)",
      component: <ExtremePerformanceDemo />,
    },

    {
      key: "form" as const,
      label: "useImperativeHandle",
      component: <FormDemo />,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          padding: "32px 24px",
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              margin: "0 0 24px 0",
              color: "#1a202c",
              fontSize: "32px",
              fontWeight: "700",
              letterSpacing: "-0.025em",
            }}
          >
            React Built-in Hooks 데모
          </h1>
          <p
            style={{
              margin: "0 0 32px 0",
              color: "#64748b",
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            useLayoutEffect, useEffect, useTransition, useImperativeHandle의
            실제 사용 예시와 성능 비교
          </p>

          {/* 탭 네비게이션 */}
          <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {demos.map((demo) => (
              <button
                key={demo.key}
                onClick={() => setActiveDemo(demo.key)}
                style={{
                  padding: "12px 24px",
                  border: "2px solid transparent",
                  borderRadius: "12px",
                  backgroundColor:
                    activeDemo === demo.key ? "#3b82f6" : "#f1f5f9",
                  color: activeDemo === demo.key ? "white" : "#475569",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  outline: "none",
                  ...(activeDemo === demo.key
                    ? {}
                    : {
                        ":hover": {
                          backgroundColor: "#e2e8f0",
                          transform: "translateY(-1px)",
                        },
                      }),
                }}
                onMouseEnter={(e) => {
                  if (activeDemo !== demo.key) {
                    e.currentTarget.style.backgroundColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDemo !== demo.key) {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {demo.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main
        style={{
          padding: "40px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          {demos.find((demo) => demo.key === activeDemo)?.component}
        </div>
      </main>

      {/* 푸터 */}
      <footer
        style={{
          padding: "48px 24px",
          backgroundColor: "#1e293b",
          color: "#f1f5f9",
          marginTop: "64px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3
            style={{
              margin: "0 0 32px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "white",
            }}
          >
            React Hooks 핵심 가이드
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                padding: "24px",
                backgroundColor: "#334155",
                borderRadius: "12px",
                border: "1px solid #475569",
              }}
            >
              <h4
                style={{
                  color: "#ef4444",
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                ❌ useEffect
              </h4>
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
                <li>
                  브라우저가 화면을 그린 <strong>후</strong> 실행
                </li>
                <li>DOM 변경 시 깜빡임 발생 가능</li>
                <li>비동기적으로 실행</li>
                <li>사용자가 중간 상태를 볼 수 있음</li>
              </ul>
            </div>

            <div
              style={{
                padding: "24px",
                backgroundColor: "#334155",
                borderRadius: "12px",
                border: "1px solid #475569",
              }}
            >
              <h4
                style={{
                  color: "#22c55e",
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                ✅ useLayoutEffect
              </h4>
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
                <li>
                  브라우저가 화면을 그리기 <strong>전</strong> 실행
                </li>
                <li>DOM 변경이 부드럽게 적용</li>
                <li>동기적으로 실행</li>
                <li>최종 결과만 사용자에게 보여줌</li>
              </ul>
            </div>

            <div
              style={{
                padding: "24px",
                backgroundColor: "#334155",
                borderRadius: "12px",
                border: "1px solid #475569",
              }}
            >
              <h4
                style={{
                  color: "#8b5cf6",
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                🚀 useTransition
              </h4>
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
                <li>긴급 vs 비긴급 업데이트 구분</li>
                <li>UI 블로킹 없는 부드러운 렌더링</li>
                <li>로딩 상태 제공 (isPending)</li>
                <li>사용자 경험 대폭 개선</li>
              </ul>
            </div>

            <div
              style={{
                padding: "24px",
                backgroundColor: "#334155",
                borderRadius: "12px",
                border: "1px solid #475569",
              }}
            >
              <h4
                style={{
                  color: "#3b82f6",
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                🎯 useImperativeHandle
              </h4>
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
                <li>부모 컴포넌트에서 자식 제어</li>
                <li>forwardRef와 함께 사용</li>
                <li>명령형 API 노출</li>
                <li>특별한 경우에만 사용 권장</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              border: "1px solid #334155",
            }}
          >
            <h4
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#fbbf24",
              }}
            >
              💡 실제 사용 가이드라인
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <div>
                <strong style={{ color: "#22c55e" }}>
                  useLayoutEffect 사용:
                </strong>
                <br />
                DOM 측정, 위치 계산, 스타일 변경, 스크롤 위치 조정
              </div>
              <div>
                <strong style={{ color: "#ef4444" }}>useEffect 사용:</strong>
                <br />
                API 호출, 이벤트 리스너, 타이머, 일반적인 부수 효과
              </div>
              <div>
                <strong style={{ color: "#8b5cf6" }}>
                  useTransition 사용:
                </strong>
                <br />
                검색, 필터링, 정렬 등 무거운 연산이 있는 상호작용
              </div>
              <div>
                <strong style={{ color: "#3b82f6" }}>
                  useImperativeHandle 사용:
                </strong>
                <br />
                포커스 제어, 스크롤 제어, 애니메이션 트리거
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

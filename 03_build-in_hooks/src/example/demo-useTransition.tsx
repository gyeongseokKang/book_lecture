// useTransition 비교 데모 - 반응성 개선
import { useMemo, useState, useTransition } from "react";

function makeItems(n: number) {
  return Array.from(
    { length: n },
    (_, i) => `아이템 ${i} - ${Math.random().toString(16).slice(2)}`
  );
}
const ALL = makeItems(100_000);

function heavyFilter(items: string[], q: string) {
  // 데모를 위해 의도적으로 무거운 연산 추가
  const t = performance.now();
  while (performance.now() - t < 100) {
    // 100ms 동안 CPU 집약적 작업 시뮬레이션
  }
  return q
    ? items.filter((i) => i.toLowerCase().includes(q.toLowerCase()))
    : items;
}

// ❌ useTransition 없는 버전 - 블로킹 발생
function SearchWithoutTransition() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState<string[]>(ALL);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    // 무거운 연산이 UI를 블로킹합니다
    setList(heavyFilter(ALL, q));
  };

  const label = useMemo(() => `${list.length}개 결과`, [list]);

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3
        style={{
          color: "#ef4444",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        ❌ useTransition 없음 (입력 지연 발생)
      </h3>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#fef2f2",
          borderRadius: "12px",
          border: "2px solid #fecaca",
        }}
      >
        <input
          value={query}
          onChange={onChange}
          placeholder="검색어를 입력해보세요 (타이핑이 느려집니다)"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "2px solid #ef4444",
            marginBottom: "16px",
            outline: "none",
          }}
        />
        <div
          style={{
            marginBottom: "16px",
            fontWeight: "600",
            color: "#dc2626",
          }}
        >
          {label}
        </div>
        <ul
          style={{
            maxHeight: "300px",
            overflow: "auto",
            border: "2px solid #fecaca",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "white",
            margin: 0,
            listStyle: "none",
          }}
        >
          {list.slice(0, 100).map((item) => (
            <li
              key={item}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #fee2e2",
                fontSize: "14px",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ✅ useTransition 사용 버전 - 반응성 유지
function SearchWithTransition() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState<string[]>(ALL);
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q); // 긴급 업데이트: 즉시 반영
    startTransition(() => {
      // 비긴급 업데이트: 백그라운드에서 처리
      setList(heavyFilter(ALL, q));
    });
  };

  const label = useMemo(
    () => (isPending ? "🔍 검색 중..." : `${list.length}개 결과`),
    [isPending, list]
  );

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3
        style={{
          color: "#22c55e",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        ✅ useTransition 사용 (부드러운 입력)
      </h3>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f0fdf4",
          borderRadius: "12px",
          border: "2px solid #bbf7d0",
        }}
      >
        <input
          value={query}
          onChange={onChange}
          placeholder="검색어를 입력해보세요 (부드러운 타이핑)"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "2px solid #22c55e",
            marginBottom: "16px",
            outline: "none",
          }}
        />
        <div
          style={{
            marginBottom: "16px",
            fontWeight: "600",
            color: "#15803d",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isPending && (
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #22c55e",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          )}
          {label}
        </div>
        <ul
          style={{
            maxHeight: "300px",
            overflow: "auto",
            border: "2px solid #bbf7d0",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "white",
            margin: 0,
            listStyle: "none",
            opacity: isPending ? 0.7 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {list.slice(0, 100).map((item) => (
            <li
              key={item}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #dcfce7",
                fontSize: "14px",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function UseTransitionDemo() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2
        style={{
          marginBottom: "24px",
          color: "#1a202c",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        useTransition 데모
      </h2>

      <div
        style={{
          padding: "24px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "32px",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            color: "#374151",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          🚀 useTransition의 핵심 기능
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            lineHeight: "1.7",
            color: "#64748b",
          }}
        >
          <li>
            <strong>긴급 vs 비긴급 업데이트:</strong> 사용자 입력은 즉시, 무거운
            연산은 백그라운드
          </li>
          <li>
            <strong>논블로킹 렌더링:</strong> UI가 멈추지 않고 부드럽게 동작
          </li>
          <li>
            <strong>로딩 상태 제공:</strong> isPending으로 진행 상태 표시
          </li>
          <li>
            <strong>사용자 경험 개선:</strong> 반응성 있는 인터페이스 구현
          </li>
        </ul>
      </div>

      <SearchWithoutTransition />
      <SearchWithTransition />

      <div
        style={{
          padding: "24px",
          backgroundColor: "#fffbeb",
          borderRadius: "12px",
          border: "1px solid #f59e0b",
          marginTop: "32px",
        }}
      >
        <h4
          style={{
            margin: "0 0 16px 0",
            color: "#92400e",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          💡 테스트 방법
        </h4>
        <ol
          style={{
            margin: 0,
            paddingLeft: "20px",
            lineHeight: "1.7",
            color: "#92400e",
          }}
        >
          <li>
            <strong>상단 검색창:</strong> 빠르게 타이핑하면 입력이 지연되고
            끊어지는 것을 확인
          </li>
          <li>
            <strong>하단 검색창:</strong> 같은 속도로 타이핑해도 부드럽게
            입력되는 것을 확인
          </li>
          <li>
            <strong>검색 결과:</strong> 하단에서는 로딩 상태와 함께 점진적으로
            업데이트
          </li>
          <li>
            <strong>성능 차이:</strong> 개발자 도구 Performance 탭에서 프레임
            드롭 비교
          </li>
        </ol>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

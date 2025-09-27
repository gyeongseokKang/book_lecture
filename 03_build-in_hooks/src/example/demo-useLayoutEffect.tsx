// AutoResizeTextarea 비교 예시
// useEffect vs useLayoutEffect의 차이점을 보여주는 예시입니다.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// ❌ 문제가 있는 버전: useEffect 사용
function AutoResizeTextareaWithUseEffect({
  value,
  style,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
    // useEffect는 브라우저가 화면을 그린 후에 실행되므로
    // 사용자가 깜빡임(flicker)을 볼 수 있습니다.
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      style={{ overflow: "hidden", resize: "none", ...style }}
      {...rest}
    />
  );
}

// ✅ 개선된 버전: useLayoutEffect 사용
function AutoResizeTextareaWithUseLayoutEffect({
  value,
  style,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
    // useLayoutEffect는 브라우저가 화면을 그리기 전에 실행되므로
    // 깜빡임 없이 부드러운 UI를 제공합니다.
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      style={{ overflow: "hidden", resize: "none", ...style }}
      {...rest}
    />
  );
}

// 비교 데모 컴포넌트
export default function AutoResizeTextareaDemo() {
  const [text1, setText1] = useState("첫 번째 줄\n두 번째 줄");
  const [text2, setText2] = useState("첫 번째 줄\n두 번째 줄");

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2>AutoResize Textarea 비교</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "red" }}>❌ useEffect 사용 (깜빡임 발생)</h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          텍스트를 빠르게 입력하면 높이 조정 시 깜빡임을 볼 수 있습니다.
        </p>
        <AutoResizeTextareaWithUseEffect
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="여기에 여러 줄 텍스트를 입력해보세요..."
          style={{
            width: "100%",
            padding: "10px",
            border: "2px solid #ff6b6b",
            borderRadius: "4px",
            fontFamily: "monospace",
          }}
        />
      </div>

      <div>
        <h3 style={{ color: "green" }}>
          ✅ useLayoutEffect 사용 (부드러운 UI)
        </h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          같은 텍스트를 입력해도 깜빡임 없이 부드럽게 높이가 조정됩니다.
        </p>
        <AutoResizeTextareaWithUseLayoutEffect
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="여기에 여러 줄 텍스트를 입력해보세요..."
          style={{
            width: "100%",
            padding: "10px",
            border: "2px solid #51cf66",
            borderRadius: "4px",
            fontFamily: "monospace",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>테스트 방법:</h4>
        <ol style={{ margin: 0, paddingLeft: "20px" }}>
          <li>두 textarea에 같은 내용을 빠르게 입력해보세요</li>
          <li>엔터를 눌러 새 줄을 추가해보세요</li>
          <li>긴 텍스트를 붙여넣기 해보세요</li>
          <li>
            상단(useEffect)에서는 깜빡임이, 하단(useLayoutEffect)에서는 부드러운
            애니메이션을 확인하세요
          </li>
        </ol>
      </div>
    </div>
  );
}

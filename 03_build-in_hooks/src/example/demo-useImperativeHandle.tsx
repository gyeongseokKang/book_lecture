// FocusableInput.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type FocusableInputHandle = {
  focus: () => void;
  select: () => void;
  shake: () => void;
};

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const FocusableInput = forwardRef<FocusableInputHandle, Props>(
  ({ invalid, className, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [shaking, setShaking] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        select: () => inputRef.current?.select(),
        shake: () => {
          setShaking(true);
          setTimeout(() => setShaking(false), 400);
        },
      }),
      []
    );

    return (
      <input
        ref={inputRef}
        className={[className, shaking ? "shake" : "", invalid ? "invalid" : ""]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    );
  }
);
FocusableInput.displayName = "FocusableInput";

// FormDemo.tsx

export default function FormDemo() {
  const ref = useRef<FocusableInputHandle>(null);
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [submittedValue, setSubmittedValue] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = value.trim().length >= 3;
    setInvalid(!ok);
    if (!ok) {
      ref.current?.shake();
      ref.current?.focus();
      ref.current?.select();
    }
    setSubmittedValue(value);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2
        style={{
          marginBottom: "24px",
          color: "#1a202c",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        useImperativeHandle 데모
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
          📝 기능 설명
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
            <strong>포커스 제어:</strong> 유효성 검사 실패 시 자동으로 입력
            필드에 포커스
          </li>
          <li>
            <strong>텍스트 선택:</strong> 오류 발생 시 기존 텍스트를 모두 선택
          </li>
          <li>
            <strong>쉐이크 애니메이션:</strong> 시각적 피드백으로 오류 상황 표시
          </li>
          <li>
            <strong>명령형 API:</strong> 부모에서 자식 컴포넌트를 직접 제어
          </li>
        </ul>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gap: "20px",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "32px",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "16px",
            }}
          >
            사용자명 (3자 이상 입력)
          </label>
          <FocusableInput
            ref={ref}
            value={value}
            invalid={invalid}
            onChange={(e) => setValue(e.target.value)}
            placeholder="사용자명을 입력하세요"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              borderRadius: "12px",
              border: invalid ? "2px solid #ef4444" : "2px solid #e2e8f0",
            }}
          />
          {invalid && (
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#ef4444",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ⚠️ 사용자명은 3자 이상이어야 합니다
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "16px 24px",
            fontSize: "16px",
            fontWeight: "700",
            borderRadius: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          등록하기
        </button>

        {submittedValue && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #22c55e",
              borderRadius: "12px",
              marginTop: "16px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#15803d",
                fontWeight: "600",
              }}
            >
              ✅ 등록 완료: <strong>{submittedValue}</strong>
            </p>
          </div>
        )}
      </form>

      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          backgroundColor: "#fffbeb",
          borderRadius: "12px",
          border: "1px solid #f59e0b",
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
          <li>입력 필드에 2자 이하로 입력하고 "등록하기" 클릭</li>
          <li>쉐이크 애니메이션과 함께 자동으로 포커스 및 텍스트 선택 확인</li>
          <li>3자 이상 입력 후 정상 등록 확인</li>
        </ol>
      </div>
    </div>
  );
}

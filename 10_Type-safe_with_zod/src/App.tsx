import { useState } from "react";
import "./App.css";
import { UserForm } from "./components/UserForm";
import { UserSchema, type User, type UserWithoutId } from "./schema/sample";

function App() {
  const [submittedUsers, setSubmittedUsers] = useState<UserWithoutId[]>([]);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    data?: User;
    error?: string;
  } | null>(null);

  const handleFormSubmit = async (data: UserWithoutId) => {
    try {
      // Zod로 데이터 검증
      const validatedData = UserSchema.parse({
        ...data,
        id: crypto.randomUUID(), // UUID 생성
      });

      setSubmittedUsers((prev) => [...prev, data]);
      setValidationResult({
        success: true,
        data: validatedData,
      });

      console.log("✅ 검증 성공:", validatedData);
    } catch (error) {
      setValidationResult({
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      });
      console.error("❌ 검증 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Zod + React Hook Form 예시
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 폼 컴포넌트 */}
          <div>
            <UserForm onSubmit={handleFormSubmit} />
          </div>

          {/* 결과 표시 */}
          <div className="space-y-6">
            {/* 검증 결과 */}
            {validationResult && (
              <div className="p-4 rounded-lg bg-white shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  검증 결과
                </h3>
                {validationResult.success ? (
                  <div className="text-green-600">
                    <p className="font-medium">✅ 검증 성공</p>
                    <pre className="mt-2 text-sm bg-green-50 p-3 rounded overflow-x-auto">
                      {JSON.stringify(validationResult.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p className="font-medium">❌ 검증 실패</p>
                    <p className="mt-2 text-sm bg-red-50 p-3 rounded">
                      {validationResult.error}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 제출된 사용자 목록 */}
            {submittedUsers.length > 0 && (
              <div className="p-4 rounded-lg bg-white shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  제출된 사용자 ({submittedUsers.length}명)
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {submittedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded border-l-4 border-blue-500"
                    >
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        역할: {user.role === "admin" ? "관리자" : "사용자"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

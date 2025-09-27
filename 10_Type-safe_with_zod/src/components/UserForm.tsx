import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserSchemaOmitId, type UserWithoutId } from "../schema/sample";

interface UserFormProps {
  onSubmit: (data: UserWithoutId) => void;
  defaultValues?: Partial<UserWithoutId>;
}

export function UserForm({ onSubmit, defaultValues }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserWithoutId>({
    resolver: zodResolver(UserSchemaOmitId),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      ...defaultValues,
    },
  });

  const onFormSubmit = async (data: UserWithoutId) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">사용자 등록</h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* 이름 필드 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="이름을 입력하세요"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 이메일 필드 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* 역할 필드 */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            역할
          </label>
          <select
            id="role"
            {...register("role")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="user">사용자</option>
            <option value="admin">관리자</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "등록 중..." : "사용자 등록"}
        </button>
      </form>

      {/* 에러 요약 */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800 mb-2">입력 오류:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.name && <li>• 이름: {errors.name.message}</li>}
            {errors.email && <li>• 이메일: {errors.email.message}</li>}
            {errors.role && <li>• 역할: {errors.role.message}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

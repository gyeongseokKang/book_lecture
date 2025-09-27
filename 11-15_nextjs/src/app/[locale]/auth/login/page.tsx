"use client";

import { useRouter } from "@/i18n/navigation";
import { login } from "@/shared/login";

export default function AuthLoginPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-8 max-w-4xl text-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
      <div>로그인 필요</div>
      <br />
      <button
        onClick={() => {
          login({ name: "handy" });
          router.push("/dashboard");
        }}
      >
        로그인하기
      </button>
    </div>
  );
}

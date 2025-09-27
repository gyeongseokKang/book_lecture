"use client";

import { useRouter } from "@/i18n/navigation";
import { logout } from "@/shared/login";

export default function AuthLogoutPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-8 max-w-4xl text-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Logout</h1>
      <br />
      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        로그아웃하기
      </button>
    </div>
  );
}

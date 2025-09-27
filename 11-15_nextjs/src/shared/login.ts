"use server";

import { cookies } from "next/headers";

export async function login(user: { name: string }) {
  const cookieStore = await cookies();
  // 실제 로그인 요청

  cookieStore.set("auth-user", user.name);
}

export async function logout() {
  const cookieStore = await cookies();
  // 세션 끊기 요청

  cookieStore.delete("auth-user");
}

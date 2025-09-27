import { Link } from "@/i18n/navigation";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authUser = cookieStore.get("auth-user");

  return (
    <div className="container mx-auto p-8 max-w-4xl text-2xl">
      <div>DashboardPage</div>
      <br />
      {authUser ? <div>Hello {authUser?.value}</div> : <div>Hello Guest</div>}
      <br />
      {authUser ? (
        <Link href="/auth/logout">Logout</Link>
      ) : (
        <Link href="/auth/login">Login</Link>
      )}
    </div>
  );
}

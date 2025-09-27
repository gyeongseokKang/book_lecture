"use client";

import { Link } from "@/i18n/navigation";

export default function Home() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Middleware in Next.js
      </h1>
      <Link href="/dashboard" className="underline">
        Dashboard
      </Link>
    </div>
  );
}

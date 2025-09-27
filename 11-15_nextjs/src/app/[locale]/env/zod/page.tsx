import { env } from "@/shared/config/env";

export default function EnvZodPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">EnvZodPage</h1>
      {JSON.stringify(env)}
      <div>{env.HANDY}</div>
    </div>
  );
}

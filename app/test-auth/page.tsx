import { auth } from "@/lib/auth";

export default async function TestAuthPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Auth Test</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
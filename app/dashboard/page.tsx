import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">
        Welcome back, {session?.user.name}
      </h1>
      <p className="text-gray-600">
        You're logged in as a{" "}
        <span className="font-medium">
          {session?.user.role.toLowerCase().replace("_", " ")}
        </span>
        .
      </p>
    </div>
  );
}
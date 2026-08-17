import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-medium flex items-center justify-center text-lg shrink-0">
              {session?.user.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back, {session?.user.name}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                You&apos;re logged in as a{" "}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                  {session?.user.role.toLowerCase().replace("_", " ")}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
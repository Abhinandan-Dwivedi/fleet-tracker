import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        userName={session.user.name ?? "User"}
        userRole={session.user.role}
      />
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}

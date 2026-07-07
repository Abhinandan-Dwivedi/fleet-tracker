import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
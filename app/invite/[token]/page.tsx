"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { trpc } from "@/lib/trpc";

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const inviteQuery = trpc.invite.getByToken.useQuery({ token: params.token });

  const acceptInvite = trpc.invite.accept.useMutation({
    onSuccess: async (data) => {
      await signIn("credentials", {
        email: data.email,
        password,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    acceptInvite.mutate({ token: params.token, name, password });
  };

  if (inviteQuery.isLoading) {
    return <div className="p-8 text-center">Loading invite...</div>;
  }

  if (inviteQuery.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{inviteQuery.error.message}</p>
      </div>
    );
  }

  const invite = inviteQuery.data!;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-1">Join {invite.company.name}</h1>
        <p className="text-sm text-gray-500 mb-6">
          You&apos;ve been invited as a {invite.role.toLowerCase().replace("_", " ")}. Set a password to continue.
        </p>

        {acceptInvite.error && (
          <p className="text-red-500 text-sm mb-4">{acceptInvite.error.message}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={invite.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={acceptInvite.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {acceptInvite.isPending ? "Joining..." : "Join team"}
        </button>
      </form>
    </div>
  );
}
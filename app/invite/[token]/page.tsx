"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { ErrorAlert, Spinner, humanize } from "@/components/ui";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">FleetTrack</span>
      </div>
      {children}
    </div>
  );
}

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
    return (
      <Shell>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner className="h-4 w-4 text-subtle" />
          Loading invite...
        </div>
      </Shell>
    );
  }

  if (inviteQuery.error) {
    return (
      <Shell>
        <div className="w-full max-w-sm">
          <ErrorAlert message={inviteQuery.error.message} />
        </div>
      </Shell>
    );
  }

  const invite = inviteQuery.data!;

  return (
    <Shell>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm animate-fade-in p-6 sm:p-8"
      >
        <span className="badge border-brand/30 bg-brand/10 text-brand-ink">
          <span className="badge-dot" />
          {humanize(invite.role)} invite
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Join {invite.company.name}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          You&apos;ve been invited as a {invite.role.toLowerCase().replace("_", " ")}. Set a password to continue.
        </p>

        {acceptInvite.error && (
          <div className="mt-5">
            <ErrorAlert message={acceptInvite.error.message} />
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="invite-email" className="label">Email</label>
            <input
              id="invite-email"
              value={invite.email}
              disabled
              className="input"
            />
          </div>

          <div>
            <label htmlFor="invite-name" className="label">Your name</label>
            <input
              id="invite-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="input"
              required
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="invite-password" className="text-[13px] font-medium text-foreground">
                Password
              </label>
              <span className="text-xs text-subtle">At least 8 characters</span>
            </div>
            <input
              id="invite-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="input"
              minLength={8}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={acceptInvite.isPending}
          className="btn btn-primary mt-6 w-full"
        >
          {acceptInvite.isPending && <Spinner />}
          {acceptInvite.isPending ? "Joining..." : "Join team"}
        </button>
      </form>
    </Shell>
  );
}

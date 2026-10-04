"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  CountChip,
  EmptyState,
  ErrorAlert,
  Icons,
  ListSkeleton,
  PageHeader,
  Spinner,
  avatarTint,
  humanize,
} from "@/components/ui";

export default function TeamPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"DISPATCHER" | "FLEET_MANAGER">("DISPATCHER");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const utils = trpc.useUtils();
  const invitesQuery = trpc.invite.list.useQuery();

  const createInvite = trpc.invite.create.useMutation({
    onSuccess: (invite) => {
      const link = `${window.location.origin}/invite/${invite.token}`;
      setInviteLink(link);
      setEmail("");
      utils.invite.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLink("");
    createInvite.mutate({ email, role });
  };

  // UI convenience only: copy the generated link to the clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "FLEET_MANAGER":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "DISPATCHER":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="page animate-fade-in space-y-8">
      <PageHeader
        eyebrow="Access"
        title="Team & permissions"
        description="Invite team members and manage role-based access for fleet operations."
      />

      {/* Invite form */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">Invite a team member</h2>
          <p className="mt-0.5 text-sm text-muted">
            We&apos;ll generate a one-time link you can share with them.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:flex-[2]">
            <label htmlFor="invite-email" className="label">
              Email address
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="input"
              required
            />
          </div>

          <div className="w-full sm:flex-1">
            <label htmlFor="invite-role" className="label">
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "DISPATCHER" | "FLEET_MANAGER")}
              className="input select"
            >
              <option value="DISPATCHER">Dispatcher</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createInvite.isPending}
            className="btn btn-primary w-full sm:w-auto"
          >
            {createInvite.isPending ? (
              <>
                <Spinner />
                Sending…
              </>
            ) : (
              <>
                <Icons.Mail className="h-4 w-4" />
                Send invite
              </>
            )}
          </button>
        </form>

        {createInvite.error && (
          <div className="mt-4">
            <ErrorAlert message={createInvite.error.message} />
          </div>
        )}

        {inviteLink && (
          <div className="mt-4 animate-fade-in rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Icons.Check className="h-3 w-3" />
              </span>
              Invite link created
            </p>
            <p className="mt-1 text-sm text-emerald-800">Share this URL with your teammate:</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <code className="min-w-0 flex-1 select-all break-all rounded-md border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-emerald-900">
                {inviteLink}
              </code>
              <button type="button" onClick={copyLink} className="btn btn-secondary btn-sm">
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Pending invites */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="section-label">Pending invites</h2>
          <CountChip count={invitesQuery.data?.length || 0} />
        </div>

        {invitesQuery.isLoading && <ListSkeleton rows={2} />}

        {!invitesQuery.isLoading && invitesQuery.data?.length === 0 && (
          <EmptyState
            icon={<Icons.Mail className="h-5 w-5" />}
            title="No pending invites"
            description="Invites you send will show here until they're accepted."
          />
        )}

        {!!invitesQuery.data?.length && (
          <ul className="card divide-y divide-line overflow-hidden">
            {invitesQuery.data.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-surface-muted sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`avatar ${avatarTint(invite.email ?? "T")}`}>
                    {invite.email?.[0]?.toUpperCase() || "T"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {invite.email}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted">Invitation pending</p>
                  </div>
                </div>

                <span className={`badge ${getRoleBadge(invite.role)}`}>
                  {humanize(invite.role)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

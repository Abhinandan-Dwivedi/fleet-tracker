"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function TeamPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"DISPATCHER" | "FLEET_MANAGER">("DISPATCHER");
  const [inviteLink, setInviteLink] = useState("");

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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "FLEET_MANAGER":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "DISPATCHER":
        return "bg-sky-50 text-sky-700 border-sky-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Team & Permissions
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Invite team members and manage role-based access for fleet operations.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Access Management
          </span>
        </div>

        {/* Compact Invite Form Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Invite Team Member
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-[2] w-full">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                required
              />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "DISPATCHER" | "FLEET_MANAGER")}
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              >
                <option value="DISPATCHER">Dispatcher</option>
                <option value="FLEET_MANAGER">Fleet Manager</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={createInvite.isPending}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-5 rounded-lg disabled:opacity-50 transition-all text-xs shadow-sm flex items-center justify-center gap-2 shrink-0 h-[34px]"
            >
              {createInvite.isPending ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <span>+ Send Invite</span>
              )}
            </button>
          </form>

          {createInvite.error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200/80 text-red-600 text-xs mt-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{createInvite.error.message}</span>
            </div>
          )}

          {inviteLink && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-3 mt-3 text-xs text-emerald-900">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Invite link created successfully
                </span>
              </div>
              <p className="text-emerald-700 text-[11px] mb-1.5">Share this URL with your teammate:</p>
              <div className="bg-white border border-emerald-200 rounded-md p-2 font-mono text-[11px] text-emerald-800 break-all select-all">
                {inviteLink}
              </div>
            </div>
          )}
        </div>

        {/* Pending Invites List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Invites ({invitesQuery.data?.length || 0})
            </h2>
          </div>

          {!invitesQuery.isLoading && invitesQuery.data?.length === 0 && (
            <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-xl shadow-sm">
              <p className="text-xs font-medium text-slate-500">No pending invites</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2.5">
            {invitesQuery.data?.map((invite) => (
              <div
                key={invite.id}
                className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0 border border-slate-200/60">
                    {invite.email?.[0]?.toUpperCase() || "T"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {invite.email}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Invitation Pending
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border shrink-0 ${getRoleBadge(
                    invite.role
                  )}`}
                >
                  {invite.role.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
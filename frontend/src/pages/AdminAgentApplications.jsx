import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle, XCircle, Clock, ExternalLink,
  Users, RefreshCw, ChevronDown, ChevronRight, X, Mail, Copy, Check
} from "lucide-react";
import GradientText from "../react-bits/GradientText/GradientText";
import ShinyText from "../react-bits/ShinyText/ShinyText";
import sellRequestBgImage from "../assets/images/sellRequestBgImage1.jpg";

function createFallbackAgentEmail(app) {
  const presentYear = new Date().getFullYear();
  const nameSource = [app?.firstName, app?.lastName].filter(Boolean).join("") || app?.userId?.username || "agent";
  const normalizedName = nameSource.toLowerCase().replace(/[^a-z0-9]/g, "") || "agent";
  const randomNumber = String(Math.floor(Math.random() * 100)).padStart(2, "0");

  return `${normalizedName}${randomNumber}wheels${presentYear}@gmail.com`;
}

// ─── Approve Modal (Assign Agent Email) ────────────────────────────────────────
function ApproveModal({ app, onConfirm, onCancel, loading }) {
  const suggested = app?.suggestedAgentEmail || createFallbackAgentEmail(app);

  const [agentEmail, setAgentEmail] = useState(suggested);
  const [copied, setCopied] = useState(false);

  const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(agentEmail.trim());

  const handleCopy = () => {
    navigator.clipboard.writeText(agentEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 shadow-2xl shadow-blue-500/10 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Assign Agent Email
            </h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Applicant Info */}
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-3 mb-5">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Applicant</p>
            <p className="text-white font-semibold">
              {[app?.firstName, app?.lastName].filter(Boolean).join(" ") || app?.userId?.username || "Unknown"}
            </p>
            <p className="text-gray-400 text-sm">{app?.email}</p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 text-sm text-blue-200 leading-relaxed">
            <p className="font-semibold mb-1">📋 How it works:</p>
            <p className="text-gray-400 text-xs">
              Enter a dedicated agent email for this applicant. This email will be added to the system and the applicant will be notified to sign up with it to gain agent privileges.
            </p>
            <p className="text-gray-500 text-xs mt-2 italic">
              Suggested format: <span className="text-blue-300">name + 2 random digits + wheels + year @gmail.com</span>
            </p>
          </div>

          {/* Email Input */}
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Agent Email <span className="text-red-400">*</span>
          </label>
          <div className="relative mb-1">
            <input
              type="email"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              placeholder="e.g. john42wheels2026@gmail.com"
              className={`w-full px-4 py-3 pr-10 bg-gray-900/60 border rounded-xl text-gray-200 placeholder-gray-500
                focus:outline-none focus:ring-2 transition-all text-sm
                ${isValid
                  ? "border-emerald-500/50 focus:ring-emerald-500/30"
                  : "border-red-500/40 focus:ring-red-500/30"}`}
            />
            <button
              type="button"
              onClick={handleCopy}
              title="Copy email"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {!isValid && agentEmail && (
            <p className="text-red-400 text-xs mb-3 ml-1">Please enter a valid email address.</p>
          )}
          {isValid && (
            <p className="text-emerald-400 text-xs mb-3 ml-1">✓ Valid email</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(agentEmail.trim())}
              disabled={loading || !isValid}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-300 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Approving...</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Approve & Assign</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Rejection Modal ───────────────────────────────────────────────────────────
function RejectModal({ app, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Reject Application
            </h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-3 mb-4">
            <p className="text-sm text-gray-400">Applicant</p>
            <p className="text-white font-medium">{app?.userId?.username || "Unknown"}</p>
            <p className="text-gray-400 text-sm">{app?.email}</p>
          </div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reason for Rejection <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Provide feedback to the applicant..."
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none mb-4 text-sm"
          />
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            >
              {loading ? "Rejecting..." : "Confirm Reject"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    pending: { cls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30", icon: <Clock className="w-3 h-3" />, label: "Pending" },
    approved: { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: <CheckCircle className="w-3 h-3" />, label: "Approved" },
    rejected: { cls: "bg-red-500/15 text-red-300 border-red-500/30", icon: <XCircle className="w-3 h-3" />, label: "Rejected" },
  };
  const { cls, icon, label } = cfg[status] || cfg.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {icon}{label}
    </span>
  );
}

function ApplicationCard({ app, onApprove, onReject, actionLoading, targetId }) {
  const isLoading = actionLoading && targetId === app._id;

  const fullName = [app.firstName, app.lastName].filter(Boolean).join(" ") || app.userId?.username || "Unknown";

  return (
    <div className={`bg-slate-900/35 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-200 shadow-lg
      ${app.status === "approved" ? "border-emerald-500/30" : app.status === "rejected" ? "border-red-500/30" : "border-slate-700"}`}>
      {/* Card Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {(app.firstName?.[0] || app.userId?.username?.[0] || "?").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{fullName}</p>
            <p className="text-gray-400 text-sm truncate">{app.email}</p>
            {app.city && app.state && (
              <p className="text-gray-500 text-xs">{app.city}, {app.state}</p>
            )}
          </div>
        </div>

        {/* Status + Date + Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={app.status} />
          <span className="text-gray-500 text-xs hidden sm:block">
            {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <a
            href={app.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-300 hover:text-teal-300 text-xs font-medium border border-teal-500/30 rounded-lg px-2.5 py-1.5 hover:bg-teal-500/10 transition-all"
          >
            <ExternalLink className="w-3 h-3" /> Resume
          </a>
          <Link
            to={`/admin/agent-applications/${app._id}`}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-semibold bg-gray-700/80 hover:bg-teal-600 border border-gray-600/50 hover:border-teal-500 rounded-lg px-3 py-1.5 transition-all shadow-sm"
          >
            Full Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          {app.status === "pending" && (
            <div className="flex items-center gap-1.5 ml-1 border-l border-gray-700/50 pl-2">
              <button
                disabled={isLoading}
                onClick={() => onApprove(app)}
                className="flex items-center gap-1 text-emerald-400 hover:text-white text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 rounded-lg px-2.5 py-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
              </button>
              <button
                disabled={isLoading}
                onClick={() => onReject(app)}
                className="flex items-center gap-1 text-red-400 hover:text-white text-xs font-semibold bg-red-500/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 rounded-lg px-2.5 py-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminAgentApplications() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [toast, setToast] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);   // app object → opens RejectModal
  const [approveModal, setApproveModal] = useState(null); // app object → opens ApproveModal
  const [filterStatus, setFilterStatus] = useState("all");

  // Redirect if not admin
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800 border border-red-500/30 rounded-2xl p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold text-lg">Admin Access Required</p>
          <p className="text-gray-400 text-sm mt-1">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/backend/agent-hiring/applications", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        setError(data.message || "Failed to fetch applications.");
      }
    } catch {
      setError("Failed to fetch applications.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

  // Called when admin clicks Approve → opens the email assignment modal
  const openApproveModal = (app) => setApproveModal(app);

  // Called when admin confirms approval from the modal with their chosen agentEmail
  const handleApproveConfirm = async (agentEmail) => {
    if (!approveModal) return;
    setActionLoading(true);
    setTargetId(approveModal._id);
    try {
      const res = await fetch(`/backend/agent-hiring/approve/${approveModal._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentEmail }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Approved! Agent email ${agentEmail} assigned and notification sent.`);
        fetchApplications();
      } else {
        showToast("error", data.message || "Approval failed.");
      }
    } catch {
      showToast("error", "Approval failed. Please try again.");
    }
    setApproveModal(null);
    setActionLoading(false);
    setTargetId(null);
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectModal) return;
    setActionLoading(true);
    setTargetId(rejectModal._id);
    try {
      const res = await fetch(`/backend/agent-hiring/reject/${rejectModal._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminMessage: reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Application rejected and email sent to applicant.");
        fetchApplications();
      } else {
        showToast("error", data.message || "Rejection failed.");
      }
    } catch {
      showToast("error", "Rejection failed. Please try again.");
    }
    setRejectModal(null);
    setActionLoading(false);
    setTargetId(null);
  };

  // Stats
  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending").length;
  const approved = applications.filter((a) => a.status === "approved").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  // Filtered
  const filtered = filterStatus === "all" ? applications : applications.filter((a) => a.status === filterStatus);

  return (
    <div
      className="min-h-screen pt-32 pb-20 px-4"
      style={{
        backgroundImage: `url(${sellRequestBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium max-w-sm
          ${toast.type === "success"
            ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-300"
            : "bg-red-900/90 border-red-500/50 text-red-300"}`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Approve Modal (Assign Agent Email) */}
      {approveModal && (
        <ApproveModal
          app={approveModal}
          onConfirm={handleApproveConfirm}
          onCancel={() => setApproveModal(null)}
          loading={actionLoading}
        />
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <RejectModal
          app={rejectModal}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectModal(null)}
          loading={actionLoading}
        />
      )}

      <div className="max-w-5xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-2xl shadow-blue-500/10 rounded-2xl p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-block bg-slate-700/80 border border-slate-600 rounded-full px-3 py-1 text-slate-300 text-xs font-medium mb-3">
              Admin Panel
            </div>
            <h1 className="text-3xl font-bold">
              <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={10} className="text-3xl font-bold">
                Agent Applications
              </GradientText>
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
              <Users className="w-4 h-4" /> {total} total application{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-xl border border-gray-600/50 text-sm font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending", count: pending, cls: "border-yellow-500/20 bg-slate-900/40", txtCls: "text-yellow-400" },
            { label: "Approved", count: approved, cls: "border-emerald-500/20 bg-slate-900/40", txtCls: "text-emerald-400" },
            { label: "Rejected", count: rejected, cls: "border-red-500/20 bg-slate-900/40", txtCls: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border ${s.cls} p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.txtCls}`}>{s.count}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                filterStatus === f
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-900/40 text-gray-400 border-slate-700 hover:text-white hover:border-slate-500"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "all" ? ` (${total})` : f === "pending" ? ` (${pending})` : f === "approved" ? ` (${approved})` : ` (${rejected})`}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-300">{error}</p>
            <button onClick={fetchApplications} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/35 border border-slate-700 rounded-2xl">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No {filterStatus === "all" ? "" : filterStatus} applications found</p>
            <p className="text-gray-600 text-sm mt-1">Applications will appear here once users submit them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                onApprove={openApproveModal}
                onReject={(a) => setRejectModal(a)}
                actionLoading={actionLoading}
                targetId={targetId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



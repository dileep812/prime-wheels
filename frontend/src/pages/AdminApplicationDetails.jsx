import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft, FileText, User, MapPin, Briefcase, Car, Upload, AlertCircle, FileCheck2, ShieldCheck, ArrowLeft, CheckCircle, XCircle, Mail, X, Check, Copy } from "lucide-react";
import GradientText from "../react-bits/GradientText/GradientText";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
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

export default function AdminApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);   // opens RejectModal
  const [approveModal, setApproveModal] = useState(null); // opens ApproveModal

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const res = await fetch(`/backend/agent-hiring/${id}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to load application details.");
      } else {
        setApp(data.application);
      }
    } catch (err) {
      setError("An error occurred while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApproveConfirm = async (agentEmail) => {
    if (!approveModal) return;
    setActionLoading(true);
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
        fetchApplicationDetails(); // Refresh details to show new status
      } else {
        showToast("error", data.message || "Approval failed.");
      }
    } catch {
      showToast("error", "Approval failed. Please try again.");
    }
    setApproveModal(null);
    setActionLoading(false);
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectModal) return;
    setActionLoading(true);
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
        fetchApplicationDetails(); // Refresh details
      } else {
        showToast("error", data.message || "Rejection failed.");
      }
    } catch {
      showToast("error", "Rejection failed. Please try again.");
    }
    setRejectModal(null);
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          backgroundImage: `url(${sellRequestBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 text-center"
        style={{
          backgroundImage: `url(${sellRequestBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-400 mb-6">{error || "Application not found"}</p>
          <button onClick={() => navigate("/admin/agent-applications")} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">Go Back</button>
        </div>
      </div>
    );
  }

  const fullName = [app.firstName, app.lastName].filter(Boolean).join(" ");
  const boolYesNo = (val) => val ? "Yes" : "No";

  return (
    <div
      className="min-h-screen pt-36 pb-20 px-4 font-sans md:pt-40"
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
        <div className={`fixed top-24 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium max-w-sm
          ${toast.type === "success"
            ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-300"
            : "bg-red-900/90 border-red-500/50 text-red-300"}`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Approve Modal */}
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
        {/* Back */}
        <div className="mb-6 relative z-[60] pointer-events-auto">
          <button
            onClick={() => navigate("/admin/agent-applications")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group cursor-pointer pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col mb-8">
            <div className="inline-block self-start bg-slate-700/80 border border-slate-600 rounded-full px-3 py-1 text-slate-300 text-xs font-medium mb-3">
              Admin Panel
            </div>
            <h1 className="text-3xl font-bold">
              <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={10} className="text-3xl font-bold">
                Application Details
              </GradientText>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Full view of agent hiring form data for <span className="text-blue-300 font-medium">{fullName}</span></p>
        </div>

        {/* Global Status badge */}
        <div className="bg-slate-900/35 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {(app.firstName?.[0] || "?").toUpperCase()}
             </div>
             <div>
                <h2 className="text-lg font-bold text-white mb-1">{fullName}</h2>
                <p className="text-gray-400 text-sm">{app.email}</p>
             </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
              app.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              app.status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
              "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}>
              {app.status.toUpperCase()}
            </span>

            {app.status === "pending" && (
              <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-2 sm:border-l sm:border-gray-700/50 sm:pl-3">
                <button
                  disabled={actionLoading}
                  onClick={() => setApproveModal(app)}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-white text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 rounded-lg px-4 py-2 transition-all shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => setRejectModal(app)}
                  className="flex items-center gap-1.5 text-red-400 hover:text-white text-sm font-semibold bg-red-500/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 rounded-lg px-4 py-2 transition-all shadow-sm disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Personal Details */}
          <SectionCard icon={<User className="w-5 h-5" />} title="1. Personal Details">
            <DetailItem label="First Name" value={app.firstName} />
            <DetailItem label="Last Name" value={app.lastName} />
            <DetailItem label="Date of Birth" value={app.dateOfBirth} />
            <DetailItem label="Gender" value={app.gender} />
          </SectionCard>

          {/* Section 2: Contact Details */}
          <SectionCard icon={<MapPin className="w-5 h-5" />} title="2. Contact Details">
            <DetailItem label="Phone Number" value={app.phone} />
            <DetailItem label="Address" value={app.address} />
            <DetailItem label="City" value={app.city} />
            <DetailItem label="State" value={app.state} />
            <DetailItem label="Pincode" value={app.pincode} />
          </SectionCard>

          {/* Section 3: Identity Verification */}
          <SectionCard icon={<ShieldCheck className="w-5 h-5" />} title="3. Identity Verification">
            <DetailItem label="Aadhar Number" value={app.aadharNumber} />
            <DocumentLink label="ID Proof Document" url={app.idProofUrl} />
          </SectionCard>

          {/* Section 4: Driving Information */}
          <SectionCard icon={<Car className="w-5 h-5" />} title="4. Driving Information">
            <DetailItem label="License Number" value={app.drivingLicenseNumber} />
            <DetailItem label="Expiry Date" value={app.licenseExpiryDate ? new Date(app.licenseExpiryDate).toLocaleDateString() : 'N/A'} />
            <DocumentLink label="Driving License Document" url={app.drivingLicenseUrl} />
          </SectionCard>

          {/* Section 5: Work Experience */}
          <SectionCard icon={<Briefcase className="w-5 h-5" />} title="5. Work Experience">
            <DetailItem label="Current Job" value={app.currentJob || "None"} />
            <DetailItem label="Previous Job" value={app.previousJob || "None"} />
            <DetailItem label="Years of Experience" value={app.yearsOfExperience} />
            <DetailItem label="Car Sales Experience" value={boolYesNo(app.hasCarSalesExperience)} />
          </SectionCard>

          {/* Section 6: Automobile Knowledge */}
          <SectionCard icon={<Car className="w-5 h-5" />} title="6. Automobile Knowledge">
            <DetailItem label="General Knowledge" value={app.carKnowledge} fullWidth />
            <DetailItem label="Transaction Experience" value={app.vehicleTransactionExperience} fullWidth />
          </SectionCard>

          {/* Section 7: Work Location */}
          <SectionCard icon={<MapPin className="w-5 h-5" />} title="7. Work Location">
            <DetailItem label="Preferred City" value={app.preferredWorkingCity} />
            <DetailItem label="Willing to Travel" value={boolYesNo(app.willingToTravel)} />
          </SectionCard>

          {/* Section 8 & 9: Availability & Skills */}
          <SectionCard icon={<Briefcase className="w-5 h-5" />} title="8 & 9. Availability & Skills">
            <DetailItem label="Employment Type" value={app.employmentType} />
            <DetailItem label="Available Days" value={app.availableWorkingDays} />
            <DetailItem label="Languages Known" value={app.languagesKnown || "N/A"} fullWidth />
            <DetailItem label="Customer Handling" value={app.customerHandlingExperience || "N/A"} />
            <DetailItem label="Sales Experience" value={app.salesExperience || "N/A"} />
          </SectionCard>

          {/* Section 10: References */}
          <SectionCard icon={<User className="w-5 h-5" />} title="10. References" className="col-span-1 md:col-span-2">
            <DetailItem label="Reference Name" value={app.referenceName || "N/A"} />
            <DetailItem label="Reference Phone" value={app.referencePhone || "N/A"} />
          </SectionCard>

          {/* Section 11: Motivation */}
          <SectionCard icon={<FileText className="w-5 h-5" />} title="11. Motivation" className="col-span-1 md:col-span-2">
            <DetailItem label="Why become an agent?" value={app.motivation} fullWidth />
          </SectionCard>

           {/* Section 12: Documents List */}
          <SectionCard icon={<FileCheck2 className="w-5 h-5" />} title="12. Key Documents" className="col-span-1 md:col-span-2">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <DocumentTile label="Resume" url={app.resumeUrl} />
                <DocumentTile label="Address Proof" url={app.addressProofUrl} />
                <DocumentTile label="ID Proof" url={app.idProofUrl} />
                <DocumentTile label="Driving License" url={app.drivingLicenseUrl} />
             </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

// Subcomponents for cleaner code
function SectionCard({ icon, title, children, className = "" }) {
  return (
    <div className={`bg-slate-900/35 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-lg ${className}`}>
      <div className="bg-slate-800/70 px-5 py-4 border-b border-slate-700 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-300">{icon}</div>
        <h3 className="font-bold text-white tracking-wide">{title}</h3>
      </div>
      <div className="p-5 flex flex-wrap gap-y-5 gap-x-2">
        {children}
      </div>
    </div>
  );
}

function DetailItem({ label, value, fullWidth = false }) {
  return (
    <div className={`bg-slate-800/55 rounded-lg p-3 border border-slate-700 ${fullWidth ? "w-full" : "w-[calc(50%-0.5rem)] min-w-[140px]"}`}>
      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-gray-200 font-medium break-words leading-relaxed">{value || "—"}</p>
    </div>
  );
}

function DocumentLink({ label, url }) {
  if (!url) return <DetailItem label={label} value="Not provided" fullWidth />;
  return (
    <div className="w-full mt-1 bg-slate-800/55 rounded-lg p-3 border border-slate-700">
      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-blue-300 hover:text-white font-medium px-4 py-2 bg-blue-500/10 hover:bg-blue-600 rounded-lg border border-blue-500/30 hover:border-blue-500 transition-all shadow-sm">
        <FileText className="w-3.5 h-3.5" /> View Document
      </a>
    </div>
  );
}

function DocumentTile({ label, url }) {
  if (!url) {
    return (
       <div className="flex flex-col items-center justify-center p-5 bg-slate-900/35 border border-slate-700 rounded-xl text-gray-600">
         <FileText className="w-6 h-6 mb-3 opacity-50" />
         <p className="text-xs font-medium">{label} missing</p>
       </div>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-5 bg-slate-900/45 border border-slate-700 rounded-xl hover:border-blue-500 hover:bg-slate-800 transition-all duration-300 group shadow-lg hover:shadow-blue-900/20">
      <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-3 group-hover:border-blue-500/50 group-hover:text-blue-300 group-hover:bg-blue-500/10 text-gray-400 transition-all duration-300">
         <FileText className="w-5 h-5" />
      </div>
      <p className="text-xs font-semibold text-gray-300 group-hover:text-blue-300 tracking-wide text-center">{label}</p>
    </a>
  );
}



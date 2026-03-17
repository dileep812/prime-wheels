import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  CheckCircle, XCircle, Clock, Upload, ArrowLeft,
  ArrowRight, User, Phone, MapPin, Building2, Map,
  FileText, Car, Briefcase, Globe, Calendar, Star,
  Users, MessageSquare, ChevronRight
} from "lucide-react";
import GradientText from "../react-bits/GradientText/GradientText";
import ShinyText from "../react-bits/ShinyText/ShinyText";
import sellRequestBgImage from "../assets/images/sellRequestBgImage1.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      ease: "easeInOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
};

// ─── File Upload Component ────────────────────────────────────────────────────
function FileUpload({ label, url, onUpload, uploading, accept = "application/pdf,image/*", hint = "PDF/Image, max 5MB" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
      <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer
        ${url ? "border-blue-500/50 bg-blue-500/10" : "border-slate-600/60 hover:border-blue-500/50 bg-slate-900/40"}`}>
        <input type="file" accept={accept} onChange={onUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        {uploading ? (
          <div className="flex flex-col items-center gap-1">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
            <p className="text-slate-400 text-xs">Uploading...</p>
          </div>
        ) : url ? (
          <div className="flex flex-col items-center gap-1">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <p className="text-emerald-400 text-xs font-medium">Uploaded ✓ — click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload className="w-6 h-6 text-slate-500" />
            <p className="text-slate-400 text-xs"><span className="text-blue-300 font-medium">Click to upload</span></p>
            <p className="text-slate-500 text-xs">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Input Components ─────────────────────────────────────────────────────────
const inp = "w-full bg-slate-700 border border-slate-600 text-slate-200 p-3 rounded-lg focus:ring-2 focus:border-transparent transition duration-200 hover:border-slate-500 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400";
const sel = inp + " appearance-none";

function Field({ label, required, children }) {
  return (
    <motion.div variants={itemVariants} className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-300">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHead({ num, icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700">
      <span className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 text-sm font-bold flex-shrink-0">
        {num}
      </span>
      <div className="flex items-center gap-2 text-white font-semibold">
        {icon}
        {title}
      </div>
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
const STEPS = [
  <>Personal &<br/>Contact</>,
  <>Identity &<br/>Driving</>,
  <>Experience &<br/>Knowledge</>,
  <>Location, Skills<br/>& More</>,
  <>Documents &<br/>Agreement</>,
];

function StepBar({ step }) {
  return (
    <div className="flex items-start gap-2 mb-12 justify-between px-4 w-full max-w-4xl mx-auto pt-2 pb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div className="relative flex flex-col items-center w-16 sm:w-24 md:w-28 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all relative z-10
              ${i < step ? "bg-blue-600 border-blue-500 text-white" :
                i === step ? "bg-blue-500/15 border-blue-400 text-blue-300" :
                "bg-slate-900/60 border-slate-600 text-slate-500"}`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            {/* Absolute positioning to prevent text from affecting the flex layout/spacing of the circles, keeping them perfectly symmetric */}
            <p className={`absolute top-11 text-[11px] sm:text-[12px] md:text-[13px] leading-tight text-center block w-16 sm:w-24 md:w-28 tracking-tight drop-shadow-[0_1px_8px_rgba(15,23,42,0.85)]
              ${i === step
                ? "text-white font-semibold"
                : i < step
                  ? "text-slate-200 font-medium"
                  : "text-slate-400 font-medium"}`}>
              {s}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 min-w-3 transition-all mt-4 ${i < step ? "bg-blue-500" : "bg-slate-700"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function AgentHiringForm() {
  const { currentUser } = useSelector((s) => s.user);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [existingApp, setExistingApp] = useState(undefined);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({});

  // All form fields
  const [form, setForm] = useState({
    firstName: "", lastName: "", dateOfBirth: "", gender: "",
    phone: "", address: "", city: "", state: "", pincode: "",
    aadharNumber: "", idProofUrl: "",
    drivingLicenseNumber: "", licenseExpiryDate: "", drivingLicenseUrl: "",
    currentJob: "", previousJob: "", yearsOfExperience: "", hasCarSalesExperience: "false",
    carKnowledge: "", vehicleTransactionExperience: "",
    preferredWorkingCity: "", willingToTravel: "false",
    employmentType: "", availableWorkingDays: "",
    languagesKnown: "", customerHandlingExperience: "", salesExperience: "",
    referenceName: "", referencePhone: "",
    motivation: "",
    resumeUrl: "", addressProofUrl: "",
    agreedToTerms: false,
  });

  if (!currentUser) return <Navigate to="/sign-in" replace />;

  useEffect(() => {
    fetch("/backend/agent-hiring/my-application", { credentials: "include" })
      .then(r => r.json())
      .then(d => setExistingApp(d.success ? d.application : null))
      .catch(() => setExistingApp(null));
  }, []);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const setVal = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const isAcceptedFileType = (file, accept) => {
    const acceptedTypes = accept.split(",").map((type) => type.trim()).filter(Boolean);

    return acceptedTypes.some((type) => {
      if (type === "application/pdf") return file.type === "application/pdf";
      if (type === "image/*") return file.type.startsWith("image/");
      return file.type === type;
    });
  };

  // Generic file uploader
  const uploadFile = async (field, file, accept = "application/pdf,image/*", maxMb = 5) => {
    if (!file) return;
    const valid = isAcceptedFileType(file, accept);
    if (!valid) { setError(`${field}: invalid file type.`); return; }
    if (file.size > maxMb * 1024 * 1024) { setError(`File too large (max ${maxMb}MB).`); return; }
    setUploading(u => ({ ...u, [field]: true }));
    setError("");
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await fetch("/backend/upload/photo", { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (data.success) setVal(field, data.url);
      else setError(data.error || "Upload failed.");
    } catch { setError("Upload failed."); }
    setUploading(u => ({ ...u, [field]: false }));
  };

  // Step validation
  const validateStep = () => {
    const f = form;
    if (step === 0) {
      if (!f.firstName || !f.lastName || !f.dateOfBirth || !f.gender) return "Fill all Personal Details.";
      if (!f.phone || !f.address || !f.city || !f.state || !f.pincode) return "Fill all Contact Details.";
      if (!/^\d{10}$/.test(f.phone)) return "Phone must be 10 digits.";
      if (!/^\d{6}$/.test(f.pincode)) return "Pincode must be 6 digits.";
    }
    if (step === 1) {
      if (!f.aadharNumber || !f.idProofUrl) return "Fill Identity Verification.";
      if (!/^\d{12}$/.test(f.aadharNumber)) return "Aadhar must be 12 digits.";
      if (!f.drivingLicenseNumber || !f.licenseExpiryDate || !f.drivingLicenseUrl) return "Fill Driving Information.";
    }
    if (step === 2) {
      if (!f.yearsOfExperience || !f.carKnowledge) return "Fill Work Experience and Automobile Knowledge.";
    }
    if (step === 3) {
      if (!f.preferredWorkingCity || !f.employmentType || !f.availableWorkingDays || !f.languagesKnown)
        return "Fill Work Location, Availability, and Skills.";
    }
    if (step === 4) {
      if (!f.resumeUrl || !f.addressProofUrl) return "Upload both Resume and Address Proof.";
      if (!f.motivation) return "Fill the Motivation section.";
      if (!f.agreedToTerms) return "You must agree to the Terms and Conditions.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => { setError(""); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/backend/agent-hiring/apply", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setSubmitStatus("submitted"); setExistingApp(data.application); }
      else setError(data.message || "Submission failed. Please try again.");
    } catch { setError("Submission failed. Please try again."); }
    setLoading(false);
  };

  // ── Already an agent ──────────────────────────────────────────────────────
  if (currentUser.role === "agent") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${sellRequestBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 max-w-md w-full text-center shadow-2xl shadow-blue-500/10">
          <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">You're Already an Agent!</h2>
          <p className="text-gray-400 mb-6">You already have agent privileges on PrimeWheels.</p>
          <button onClick={() => navigate("/")} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (existingApp === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${sellRequestBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4" />
          <p className="text-gray-400">Checking your application status...</p>
        </div>
      </div>
    );
  }

  // ── Already applied ───────────────────────────────────────────────────────
  if (existingApp && submitStatus !== "submitted") {
    const cfg = {
      pending:  { icon: <Clock className="w-12 h-12 text-yellow-400" />, color: "text-yellow-400", border: "border-yellow-500/30", title: "Application Under Review", msg: "Your application is being reviewed. You'll receive an email once a decision is made." },
      approved: { icon: <CheckCircle className="w-12 h-12 text-emerald-400" />, color: "text-emerald-400", border: "border-emerald-500/30", title: "Application Approved! 🎉", msg: "Congratulations! Sign up using your assigned agent email to activate agent privileges." },
      rejected: { icon: <XCircle className="w-12 h-12 text-red-400" />, color: "text-red-400", border: "border-red-500/30", title: "Application Not Selected", msg: "Thank you for applying. Unfortunately you were not selected at this time." },
    }[existingApp.status] || {};
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-20"
        style={{
          backgroundImage: `url(${sellRequestBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className={`bg-slate-800/60 backdrop-blur-sm border ${cfg.border} rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl shadow-blue-500/10`}>
          <div className="flex justify-center mb-4">{cfg.icon}</div>
          <h2 className={`text-2xl font-bold mb-3 ${cfg.color}`}>{cfg.title}</h2>
          <p className="text-gray-400 mb-5 leading-relaxed">{cfg.msg}</p>
          {existingApp.status === "rejected" && existingApp.adminMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-left">
              <p className="text-xs text-red-400 font-semibold mb-1">Admin Feedback:</p>
              <p className="text-gray-300 text-sm">{existingApp.adminMessage}</p>
            </div>
          )}
          <div className="bg-gray-700/40 rounded-xl p-4 text-left text-sm mb-5 space-y-1">
            <p className="text-gray-300"><span className="text-gray-500">Name:</span> {existingApp.firstName} {existingApp.lastName}</p>
            <p className="text-gray-300"><span className="text-gray-500">Submitted:</span> {new Date(existingApp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <button onClick={() => navigate("/")} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">Back to Home</button>
        </div>
      </div>
    );
  }

  // ── Success after submit ──────────────────────────────────────────────────
  if (submitStatus === "submitted") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${sellRequestBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 max-w-md w-full text-center shadow-2xl shadow-blue-500/10">
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-gray-400 mb-6">Our team will review it and email you within 3–5 business days.</p>
          <button onClick={() => navigate("/")} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">Back to Home</button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN MULTI-STEP FORM
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen px-6 py-8 mx-auto lg:py-0 overflow-y-auto"
      style={{
        backgroundImage: `url(${sellRequestBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-4xl mx-auto mt-30 mb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <motion.div
        className="max-w-4xl w-full mx-auto mb-20 bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-2xl shadow-blue-500/10 p-8 rounded-2xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-block bg-slate-700/80 border border-slate-600 rounded-full px-4 py-1.5 text-slate-300 text-sm font-medium mb-4">
            Join Our Team
          </div>
          <h1 className="text-3xl font-bold mb-3">
            <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={10} className="text-3xl font-bold">
              Become a PrimeWheels Agent
            </GradientText>
          </h1>
          <p className="text-gray-400 text-sm">Fill out all sections carefully. Applications are reviewed within 3–5 business days.</p>
        </motion.div>

        {/* Step Progress */}
        <motion.div variants={itemVariants}>
          <StepBar step={step} />
        </motion.div>

        {/* Form Card */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* ════════════════ STEP 0 — Personal + Contact ════════════════ */}
            {step === 0 && (
              <>
                {/* Section 1: Personal */}
                <div>
                  <SectionHead num="1" icon={<User className="w-4 h-4 text-blue-300" />} title="Personal Details" />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="First Name" required>
                        <input className={inp} value={form.firstName} onChange={set("firstName")} placeholder="John" />
                      </Field>
                      <Field label="Last Name" required>
                        <input className={inp} value={form.lastName} onChange={set("lastName")} placeholder="Doe" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Date of Birth" required>
                        <input className={inp} type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} max={new Date().toISOString().split("T")[0]} />
                      </Field>
                      <Field label="Gender" required>
                        <select className={sel} value={form.gender} onChange={set("gender")}>
                          <option value="">Select gender</option>
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact */}
                <div>
                  <SectionHead num="2" icon={<Phone className="w-4 h-4 text-blue-300" />} title="Contact Details" />
                  <div className="space-y-4">
                    <div className="bg-slate-900/45 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3">
                      <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-blue-500/40 object-cover" />
                      <div>
                        <p className="text-sm text-slate-200 font-medium">{currentUser.username}</p>
                        <p className="text-xs text-gray-500">{currentUser.email} — account email (auto-filled)</p>
                      </div>
                    </div>
                    <Field label="Phone Number" required>
                      <input className={inp} type="tel" value={form.phone} onChange={(e) => setVal("phone", e.target.value.replace(/\D/, "").slice(0, 10))} placeholder="10-digit mobile number" maxLength={10} />
                    </Field>
                    <Field label="Street Address" required>
                      <input className={inp} value={form.address} onChange={set("address")} placeholder="123, Main Street" />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="City" required>
                        <input className={inp} value={form.city} onChange={set("city")} placeholder="Hyderabad" />
                      </Field>
                      <Field label="State" required>
                        <input className={inp} value={form.state} onChange={set("state")} placeholder="Telangana" />
                      </Field>
                      <Field label="Pincode" required>
                        <input className={inp} type="tel" value={form.pincode} onChange={(e) => setVal("pincode", e.target.value.replace(/\D/, "").slice(0, 6))} placeholder="6 digits" maxLength={6} />
                      </Field>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ════════════════ STEP 1 — Identity + Driving ════════════════ */}
            {step === 1 && (
              <>
                {/* Section 3: Identity */}
                <div>
                  <SectionHead num="3" icon={<FileText className="w-4 h-4 text-blue-300" />} title="Identity Verification" />
                  <div className="space-y-4">
                    <Field label="Aadhar Number / Government ID" required>
                      <input className={inp} type="tel" value={form.aadharNumber} onChange={(e) => setVal("aadharNumber", e.target.value.replace(/\D/, "").slice(0, 12))} placeholder="12-digit Aadhar number" maxLength={12} />
                    </Field>
                    <FileUpload label="Upload ID Proof *" url={form.idProofUrl}
                      onUpload={(e) => uploadFile("idProofUrl", e.target.files[0], "application/pdf,image/*")}
                      uploading={uploading.idProofUrl} hint="PDF/Image, max 5MB" accept="application/pdf,image/*" />
                  </div>
                </div>

                {/* Section 4: Driving */}
                <div>
                  <SectionHead num="4" icon={<Car className="w-4 h-4 text-blue-300" />} title="Driving Information" />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Driving License Number" required>
                        <input className={inp} value={form.drivingLicenseNumber} onChange={set("drivingLicenseNumber")} placeholder="DL-1234567890123" />
                      </Field>
                      <Field label="License Expiry Date" required>
                        <input className={inp} type="date" value={form.licenseExpiryDate} onChange={set("licenseExpiryDate")} min={new Date().toISOString().split("T")[0]} />
                      </Field>
                    </div>
                    <FileUpload label="Upload Driving License *" url={form.drivingLicenseUrl}
                      onUpload={(e) => uploadFile("drivingLicenseUrl", e.target.files[0], "application/pdf,image/*")}
                      uploading={uploading.drivingLicenseUrl} hint="PDF/Image, max 5MB" accept="application/pdf,image/*" />
                  </div>
                </div>
              </>
            )}

            {/* ════════════════ STEP 2 — Experience + Knowledge ════════════════ */}
            {step === 2 && (
              <>
                {/* Section 5: Work Experience */}
                <div>
                  <SectionHead num="5" icon={<Briefcase className="w-4 h-4 text-blue-300" />} title="Work Experience" />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Current Job">
                        <input className={inp} value={form.currentJob} onChange={set("currentJob")} placeholder="e.g. Sales Executive" />
                      </Field>
                      <Field label="Previous Job">
                        <input className={inp} value={form.previousJob} onChange={set("previousJob")} placeholder="e.g. Showroom Assistant" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Years of Experience" required>
                        <select className={sel} value={form.yearsOfExperience} onChange={set("yearsOfExperience")}>
                          <option value="">Select</option>
                          {["Less than 1 year","1–2 years","3–5 years","5–10 years","10+ years"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Experience in Car Sales">
                        <select className={sel} value={form.hasCarSalesExperience} onChange={set("hasCarSalesExperience")}>
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 6: Automobile Knowledge */}
                <div>
                  <SectionHead num="6" icon={<Star className="w-4 h-4 text-blue-300" />} title="Automobile Knowledge" />
                  <div className="space-y-4">
                    <Field label="Knowledge about Cars" required>
                      <textarea className={inp} rows={3} value={form.carKnowledge} onChange={set("carKnowledge")} placeholder="Describe your knowledge about cars, brands, models, market trends..." />
                    </Field>
                    <Field label="Experience Buying or Selling Vehicles">
                      <textarea className={inp} rows={2} value={form.vehicleTransactionExperience} onChange={set("vehicleTransactionExperience")} placeholder="Describe any experience you have buying or selling vehicles..." />
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* ════════════════ STEP 3 — Location, Availability, Skills, Refs ════════════════ */}
            {step === 3 && (
              <>
                {/* Section 7: Work Location */}
                <div>
                  <SectionHead num="7" icon={<MapPin className="w-4 h-4 text-blue-300" />} title="Work Location" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Preferred Working City" required>
                      <input className={inp} value={form.preferredWorkingCity} onChange={set("preferredWorkingCity")} placeholder="e.g. Hyderabad" />
                    </Field>
                    <Field label="Willing to Travel">
                      <select className={sel} value={form.willingToTravel} onChange={set("willingToTravel")}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Section 8: Availability */}
                <div>
                  <SectionHead num="8" icon={<Calendar className="w-4 h-4 text-blue-300" />} title="Availability" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full-time / Part-time" required>
                      <select className={sel} value={form.employmentType} onChange={set("employmentType")}>
                        <option value="">Select</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                      </select>
                    </Field>
                    <Field label="Available Working Days" required>
                      <input className={inp} value={form.availableWorkingDays} onChange={set("availableWorkingDays")} placeholder="e.g. Mon–Fri, or Weekends" />
                    </Field>
                  </div>
                </div>

                {/* Section 9: Skills */}
                <div>
                  <SectionHead num="9" icon={<Globe className="w-4 h-4 text-blue-300" />} title="Skills" />
                  <div className="space-y-4">
                    <Field label="Languages Known" required>
                      <input className={inp} value={form.languagesKnown} onChange={set("languagesKnown")} placeholder="e.g. English, Hindi, Telugu" />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Customer Handling Experience">
                        <input className={inp} value={form.customerHandlingExperience} onChange={set("customerHandlingExperience")} placeholder="e.g. 3 years in retail" />
                      </Field>
                      <Field label="Sales Experience">
                        <input className={inp} value={form.salesExperience} onChange={set("salesExperience")} placeholder="e.g. B2C sales, online" />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section 10: References */}
                <div>
                  <SectionHead num="10" icon={<Users className="w-4 h-4 text-blue-300" />} title="References" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Reference Name">
                      <input className={inp} value={form.referenceName} onChange={set("referenceName")} placeholder="Full name of reference" />
                    </Field>
                    <Field label="Reference Phone Number">
                      <input className={inp} type="tel" value={form.referencePhone} onChange={(e) => setVal("referencePhone", e.target.value.replace(/\D/, "").slice(0, 10))} placeholder="10-digit number" maxLength={10} />
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* ════════════════ STEP 4 — Motivation, Documents, Agreement ════════════════ */}
            {step === 4 && (
              <>
                {/* Section 11: Motivation */}
                <div>
                  <SectionHead num="11" icon={<MessageSquare className="w-4 h-4 text-blue-300" />} title="Motivation" />
                  <Field label="Why do you want to become an agent?" required>
                    <textarea className={inp} rows={4} value={form.motivation} onChange={set("motivation")} placeholder="Tell us why you want to join PrimeWheels as an agent and what makes you a great fit..." />
                  </Field>
                </div>

                {/* Section 12: Documents */}
                <div>
                  <SectionHead num="12" icon={<FileText className="w-4 h-4 text-blue-300" />} title="Documents" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FileUpload label="Upload Resume *" url={form.resumeUrl}
                      onUpload={(e) => uploadFile("resumeUrl", e.target.files[0], "application/pdf,image/*")}
                      uploading={uploading.resumeUrl} hint="PDF/Image, max 5MB" accept="application/pdf,image/*" />
                    <FileUpload label="Upload Address Proof *" url={form.addressProofUrl}
                      onUpload={(e) => uploadFile("addressProofUrl", e.target.files[0], "application/pdf,image/*")}
                      uploading={uploading.addressProofUrl} hint="PDF/Image, max 5MB" accept="application/pdf,image/*" />
                  </div>
                </div>

                {/* Section 13: Agreement */}
                <div>
                  <SectionHead num="13" icon={<CheckCircle className="w-4 h-4 text-blue-300" />} title="Agreement" />
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={form.agreedToTerms}
                        onChange={(e) => setVal("agreedToTerms", e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                        ${form.agreedToTerms ? "bg-blue-600 border-blue-500" : "border-slate-500 group-hover:border-blue-400"}`}>
                        {form.agreedToTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      I agree to the <span className="text-blue-300 font-medium">Terms and Conditions</span> of PrimeWheels.
                      I confirm that all information provided is accurate and complete to the best of my knowledge.
                      I understand that providing false information may result in rejection or termination of my agent status.
                    </span>
                  </label>
                </div>

                {/* Applying As */}
                <div className="bg-slate-900/45 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3">
                  <img src={currentUser.avatar} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-blue-500/40 object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200 font-medium truncate">{currentUser.username}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <span className="ml-auto text-xs bg-slate-700/80 text-slate-300 px-2 py-1 rounded-full flex-shrink-0">Applying as this account</span>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 0 && (
                <button type="button" onClick={prevStep}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] shadow-lg shadow-blue-900/30">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {loading
                    ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Submitting...</>
                    : <><ShinyText text="Submit Application" speed={4} baseColor="rgba(255,255,255,0.9)" /> <ChevronRight className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          </form>
        </div>
        <p className="text-center text-slate-500 text-xs mt-5">Step {step + 1} of {STEPS.length} — Applications reviewed within 3–5 business days.</p>
      </motion.div>
    </div>
  );
}


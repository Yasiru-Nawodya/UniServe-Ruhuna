import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const initialForm = {
  fullName: "",
  email: "",
  role: "STUDENT",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage("");
  }

  function validate() {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (form.fullName.trim().length < 3) {
      nextErrors.fullName = "Please enter your full name.";
    }

    const email = form.email.trim();

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.password.length < 8) {
      nextErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Temporary frontend-only confirmation.
    // Do not store passwords or user data in localStorage.
    setMessage(
      "Form validation successful. Account creation will be available when the backend is connected.",
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Desktop branding panel */}
      <section className="relative hidden min-h-screen w-1/2 overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Brand */}
          <Link
            to="/"
            className="group flex w-fit items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 transition group-hover:bg-blue-500">
              <GraduationCap size={27} />
            </div>

            <div>
              <p className="text-2xl font-extrabold tracking-tight">
                UniServe<span className="text-blue-400">.</span>
              </p>

              <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
                UNIVERSITY OF RUHUNA
              </p>
            </div>
          </Link>

          {/* Main message */}
          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-200">
              <Sparkles size={14} />
              Join the Campus Community
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
              Make your campus
              <span className="block text-blue-400">
                better, together.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-slate-300 xl:text-lg xl:leading-8">
              Create your account to report campus issues, request
              support, and track progress through one connected
              platform.
            </p>

            {/* Benefits */}
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-blue-400"
                  />

                  <p className="text-sm font-semibold text-white">
                    Simple Requests
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Report campus issues in just a few steps.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-blue-400"
                  />

                  <p className="text-sm font-semibold text-white">
                    Transparent Tracking
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Stay informed as your request progresses.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-600">
            UniServe-Ruhuna — Smart Campus Service Management
            Platform
          </p>
        </div>
      </section>

      {/* Registration area */}
      <section className="flex min-h-screen w-full flex-col bg-white lg:w-1/2">
        {/* Top navigation */}
        <div className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-12 xl:px-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-700"
          >
            Sign in
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-lg">
            {/* Heading */}
            <div className="mb-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <UserRound size={26} />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Get Started
              </p>

              <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[2.7rem]">
                Create an account
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Join UniServe-Ruhuna and get connected with campus
                services.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div className="group relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    aria-invalid={Boolean(errors.fullName)}
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                      errors.fullName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200"
                    }`}
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  University Email
                </label>

                <div className="group relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Account type */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Type
                </label>

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                >
                  <option value="STUDENT">Student</option>
                  <option value="LECTURER">
                    Lecturer / Academic Staff
                  </option>
                </select>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Service staff and administrator accounts are
                  managed separately.
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="group relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    aria-invalid={Boolean(errors.password)}
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="group relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous,
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Success message */}
              {message && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm text-blue-800"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <p className="leading-5">{message}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 hover:shadow-blue-700/20"
              >
                Create Account

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </form>

            {/* Login link */}
            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-700 transition hover:text-blue-800"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Your credentials remain private and secure
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="px-6 pb-6 text-center text-xs text-slate-400 sm:px-10">
          © {new Date().getFullYear()} UniServe-Ruhuna
        </p>
      </section>
    </div>
  );
}

export default RegisterPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
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
    }

const email = form.email.trim();

if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
  nextErrors.email = "Please enter a valid email address.";
}

    if (form.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
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

    if (Object.keys(validationErrors).length > 0) return;

    // Temporary frontend-only confirmation.
    // Do not store passwords or user data in localStorage.
    setMessage(
      "Form validation successful. Account creation will be available when the backend is connected."
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Branding panel */}
      <aside className="relative hidden w-2/5 overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <GraduationCap size={26} />
          </div>
          <div>
            <p className="text-2xl font-extrabold">
              UniServe<span className="text-blue-400">.</span>
            </p>
            <p className="text-xs tracking-widest text-slate-400">
              UNIVERSITY OF RUHUNA
            </p>
          </div>
        </Link>

        <div className="relative">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <ShieldCheck size={17} />
            Join the Campus Community
          </div>

          <h1 className="text-5xl font-extrabold leading-tight">
            Make your campus
            <span className="text-blue-400"> better, together.</span>
          </h1>

          <p className="mt-7 text-lg leading-8 text-slate-300">
            Create your account to report campus issues, request support,
            and track progress in one connected platform.
          </p>
        </div>

        <p className="relative text-sm text-slate-500">
          UniServe-Ruhuna — Smart Campus Service Management Platform
        </p>
      </aside>

      {/* Registration form */}
      <main className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-3/5 lg:px-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mx-auto w-full max-w-lg py-12">
          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <UserRound size={27} />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">
              Create an account
            </h2>
            <p className="mt-3 text-slate-500">
              Join UniServe-Ruhuna to access campus services.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Enter your full name"
                aria-invalid={Boolean(errors.fullName)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter your university email"
                aria-invalid={Boolean(errors.email)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-semibold">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              >
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer / Academic Staff</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Staff and administrator accounts will be managed separately.
              </p>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  aria-invalid={Boolean(errors.password)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {message && (
              <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-4 font-semibold text-white transition hover:bg-blue-800"
            >
              Create Account
              <ArrowRight size={19} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;

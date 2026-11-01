import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
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
} from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.login(form);

      localStorage.setItem("token", response.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.userId,
          fullName: response.fullName,
          email: response.email,
          role: response.role,
        }),
      );

      if (response.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (response.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (response.role === "SERVICE_STAFF") {
        navigate("/service-staff/dashboard");
      } else {
        setError(
          "Your account role does not have a dashboard yet.",
        );
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Desktop branding panel */}
      <section className="relative hidden min-h-screen w-1/2 overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col">
        {/* Background glow */}
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
              Smart Campus Service Platform
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
              A smarter way to
              <span className="block text-blue-400">
                care for our campus.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-slate-300 xl:text-lg xl:leading-8">
              One connected platform for students, lecturers, and
              service teams to report, manage, track, and resolve
              campus service issues.
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-blue-400"
                  />

                  <p className="text-sm font-semibold text-white">
                    Easy Reporting
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Submit campus service requests quickly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-blue-400"
                  />

                  <p className="text-sm font-semibold text-white">
                    Live Tracking
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Follow every stage of your request.
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

      {/* Login area */}
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
            to="/register"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-700"
          >
            Create account
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-9">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <LockKeyhole size={26} />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Secure Sign In
              </p>

              <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-[2.7rem]">
                Welcome back
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                Sign in to access your UniServe workspace and manage
                your campus service requests.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
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
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-700 transition hover:text-blue-800"
                    onClick={() =>
                      setError(
                        "Password recovery is not available yet.",
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
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
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 hover:shadow-blue-700/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-700 transition hover:text-blue-800"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Secure access to the UniServe platform
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

export default LoginPage;
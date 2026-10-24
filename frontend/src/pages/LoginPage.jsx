import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

const handleSubmit = (event) => {
  event.preventDefault();

  // Temporary frontend-only navigation for testing.
  navigate("/student/dashboard");
};

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-blue-700/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <GraduationCap size={27} />
          </div>
          <div>
            <p className="text-2xl font-extrabold tracking-tight">
              UniServe<span className="text-blue-400">.</span>
            </p>
            <p className="text-xs tracking-wider text-slate-400">
              UNIVERSITY OF RUHUNA
            </p>
          </div>
        </Link>

        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <ShieldCheck size={17} />
            Smart Campus Service Platform
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            A smarter way to
            <span className="text-blue-400"> care for our campus.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-8 text-slate-300">
            One connected platform for students, lecturers, and service
            teams to report, manage, and resolve campus issues.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Easy Reporting</p>
              <p className="mt-2 text-sm text-slate-400">
                Submit campus requests in minutes.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Live Tracking</p>
              <p className="mt-2 text-sm text-slate-400">
                Follow the progress of your requests.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          UniServe-Ruhuna — Smart Campus Service Management Platform
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="flex justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">
          <div className="mb-9">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <LockKeyhole size={27} />
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-3 text-slate-500">
              Sign in to access your UniServe account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <span className="text-sm font-semibold text-blue-700">
                  Forgot password?
                </span>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-12 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-4 font-semibold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800"
            >
              Sign In
              <ArrowRight size={19} />
            </button>
          </form>

          <p className="mt-9 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-700 hover:underline">
                Create an account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} UniServe-Ruhuna
        </p>
      </div>
    </div>
  );
}

export default LoginPage;


import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Laptop,
  Menu,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

const services = [
  {
    title: "IT & Network",
    description: "Report Wi-Fi, connectivity, and technical issues.",
    icon: Laptop,
  },
  {
    title: "Campus Facilities",
    description: "Request repairs and maintenance for campus facilities.",
    icon: Wrench,
  },
  {
    title: "Classroom Support",
    description: "Report classroom equipment and learning-space issues.",
    icon: BookOpen,
  },
  {
    title: "Electrical Services",
    description: "Report lighting, power, and electrical problems.",
    icon: Zap,
  },
];

const steps = [
  {
    number: "01",
    title: "Submit a request",
    description: "Describe the issue, select a category, and provide its location.",
  },
  {
    number: "02",
    title: "Track progress",
    description: "Follow your request as the responsible team reviews and handles it.",
  },
  {
    number: "03",
    title: "Get it resolved",
    description: "Receive a resolution update and share your feedback.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-100">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
              <GraduationCap size={25} />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">
                UniServe<span className="text-blue-700">.</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                University of Ruhuna
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-blue-700">Services</a>
            <a href="#how-it-works" className="hover:text-blue-700">How It Works</a>
            <a href="#about" className="hover:text-blue-700">About</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Sign In
            </button>
            <button className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
              Get Started
            </button>
          </div>

          <Menu className="md:hidden" />
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              <ShieldCheck size={15} />
              SMART CAMPUS SERVICE PLATFORM
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl">
              A better campus
              <span className="text-blue-700"> starts with you.</span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
              Report campus issues, request support, and track resolutions
              through one simple platform built for the University of Ruhuna community.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800">
                Submit a Request
                <ArrowRight size={19} />
              </button>

              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 hover:bg-slate-100"
              >
                How It Works
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="mt-12 flex items-center gap-3 text-sm text-slate-500">
              <CheckCircle2 className="text-emerald-600" size={20} />
              One platform for students, lecturers, and campus staff
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 md:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Service Portal</p>
                  <h3 className="mt-1 text-2xl font-bold">My Requests</h3>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <ClipboardList size={25} />
                </div>
              </div>

              {[
                ["Classroom projector issue", "In Progress", "bg-amber-50 text-amber-700"],
                ["Campus Wi-Fi connectivity", "Assigned", "bg-blue-50 text-blue-700"],
                ["Library lighting repair", "Resolved", "bg-emerald-50 text-emerald-700"],
              ].map(([title, status, color], index) => (
                <div
                  key={title}
                  className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">
                      0{index + 1}
                    </div>
                    <p className="text-sm font-semibold">{title}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
                    {status}
                  </span>
                </div>
              ))}

              <div className="mt-7 rounded-xl bg-blue-700 p-5 text-white">
                <p className="text-sm text-blue-100">Campus support, simplified.</p>
                <p className="mt-2 text-xl font-bold">
                  Every request matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Our Services
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
            How can we help?
          </h2>
          <p className="mt-4 max-w-xl text-slate-600">
            Find the right support for common campus issues and service needs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={27} />
                </div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Simple Process
            </p>
            <h2 className="mt-3 text-4xl font-extrabold">
              How UniServe Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Call to Action */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="rounded-3xl bg-slate-950 px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Building a better campus, together.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            UniServe-Ruhuna aims to make campus service requests
            easier to report, manage, and resolve.
          </p>
          <p className="mt-7 text-sm text-slate-400">
            Designed for the University of Ruhuna community
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} UniServe-Ruhuna. Student development project.</p>
          <p>Smart Campus Service Management Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

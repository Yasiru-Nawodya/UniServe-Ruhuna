import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardList,
  MapPin,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Total Requests",
    value: "12",
    description: "All submitted requests",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Pending",
    value: "03",
    description: "Awaiting review",
    icon: Clock3,
    color: "bg-amber-50 text-amber-700",
  },
  {
    label: "In Progress",
    value: "04",
    description: "Currently being handled",
    icon: ArrowRight,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    label: "Resolved",
    value: "05",
    description: "Successfully completed",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700",
  },
];

const recentRequests = [
  {
    id: "USR-001",
    title: "Projector not working",
    category: "Classroom Equipment",
    location: "Engineering Building",
    status: "In Progress",
    date: "20 Oct 2026",
  },
  {
    id: "USR-002",
    title: "Wi-Fi connection issue",
    category: "IT & Network",
    location: "Computer Lab",
    status: "Pending",
    date: "18 Oct 2026",
  },
  {
    id: "USR-003",
    title: "Broken classroom lighting",
    category: "Electrical",
    location: "Lecture Hall B",
    status: "Resolved",
    date: "15 Oct 2026",
  },
];

const statusStyles = {
  "In Progress": "border-indigo-200 bg-indigo-50 text-indigo-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function StudentDashboard() {
  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-16 -translate-y-16 rounded-full bg-blue-50" />
        <div className="absolute bottom-0 right-24 h-24 w-24 translate-y-12 rounded-full bg-indigo-50" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
              Student Dashboard
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Welcome to your workspace
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Report campus issues, track service requests, and
              stay informed about their progress.
            </p>
          </div>

          <Link
            to="/student/requests/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md"
          >
            <PlusCircle size={19} />
            New Request
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-slate-950">
            Request Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A quick look at your current service requests.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(
            ({
              label,
              value,
              description,
              icon: Icon,
              color,
            }) => (
              <div
                key={label}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950">
                  {value}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Recent Requests */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-950">
              Recent Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest campus issues you have reported.
            </p>
          </div>

          <Link
            to="/student/requests"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-800"
          >
            View All Requests
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/70">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Request
                </th>

                <th className="px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Category
                </th>

                <th className="px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Location
                </th>

                <th className="px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-6 py-3.5" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentRequests.map((request) => (
                <tr
                  key={request.id}
                  className="group transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {request.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-blue-600">
                        {request.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                      {request.category}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={14}
                        className="shrink-0 text-slate-400"
                      />
                      {request.location}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                    {request.date}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-extrabold ${
                        statusStyles[request.status] ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {request.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <ChevronRight
                      size={18}
                      className="ml-auto text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="p-5 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    {request.title}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-blue-600">
                    {request.id}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${
                    statusStyles[request.status] ||
                    "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-semibold text-slate-600">
                  {request.category}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />
                  {request.location}
                </span>

                <span>{request.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick action */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Need help on campus?
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Submit a service request and let the relevant team
              handle the issue.
            </p>
          </div>

          <Link
            to="/student/requests/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          >
            Create Request
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <p className="text-center text-[11px] text-slate-400">
        Dashboard information is sample data for frontend
        development.
      </p>
    </div>
  );
}

export default StudentDashboard;
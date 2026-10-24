
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  PlusCircle,
} from "lucide-react";

const stats = [
  {
    label: "Total Requests",
    value: "12",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Pending",
    value: "03",
    icon: Clock3,
    color: "bg-amber-50 text-amber-700",
  },
  {
    label: "In Progress",
    value: "04",
    icon: ArrowRight,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    label: "Resolved",
    value: "05",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700",
  },
];

const recentRequests = [
  {
    id: "USR-001",
    title: "Projector not working",
    category: "Classroom Equipment",
    status: "In Progress",
    date: "2026-10-20",
  },
  {
    id: "USR-002",
    title: "Wi-Fi connection issue",
    category: "IT & Network",
    status: "Pending",
    date: "2026-10-18",
  },
  {
    id: "USR-003",
    title: "Broken classroom lighting",
    category: "Electrical",
    status: "Resolved",
    date: "2026-10-15",
  },
];

const statusStyles = {
  "In Progress": "bg-indigo-50 text-indigo-700",
  Pending: "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Student Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to your workspace
          </h1>
          <p className="mt-2 text-slate-500">
            Track campus service requests and stay updated.
          </p>
        </div>

        <Link
          to="/student/requests/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          <PlusCircle size={19} />
          New Request
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={21} />
              </div>
            </div>

            <p className="mt-5 text-4xl font-extrabold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold">Recent Requests</h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest campus issues you have reported
            </p>
          </div>

          <Link
            to="/student/requests"
            className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Request</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {request.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {request.id}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {request.category}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {request.date}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[request.status]
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Dashboard information is sample data for frontend development.
      </p>
    </div>
  );
}

export default StudentDashboard;

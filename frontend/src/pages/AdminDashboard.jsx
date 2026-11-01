import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  UserCheck,
} from "lucide-react";
import api from "../services/api";

const statusLabel = {
  PENDING: "Pending Review",
  REVIEWED: "Reviewed",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  REOPENED: "Reopened",
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  ASSIGNED: "bg-purple-100 text-purple-700",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-700",
  REOPENED: "bg-orange-100 text-orange-700",
};

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await api.getAdminRequests();

        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Failed to load administrative requests.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const reviewedCount = requests.filter(
    (request) => request.status === "REVIEWED",
  ).length;

  const assignedActiveCount = requests.filter(
    (request) =>
      request.status === "ASSIGNED" ||
      request.status === "IN_PROGRESS",
  ).length;

  const criticalCount = requests.filter(
    (request) => request.priority === "CRITICAL",
  ).length;

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      request.status === statusFilter;

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      request.requestNumber?.toLowerCase().includes(search) ||
      request.title?.toLowerCase().includes(search) ||
      request.categoryName?.toLowerCase().includes(search) ||
      request.submittedByName?.toLowerCase().includes(search) ||
      request.location?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  const handleRefresh = () => {
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review, prioritize, and manage campus service
              requests.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Pending Review"
            value={pendingCount}
            description="Requests awaiting review"
            icon={Clock3}
            iconClassName="bg-amber-100 text-amber-700"
          />

          <StatCard
            title="Reviewed"
            value={reviewedCount}
            description="Requests reviewed by admin"
            icon={CheckCircle2}
            iconClassName="bg-blue-100 text-blue-700"
          />

          <StatCard
            title="Assigned / Active"
            value={assignedActiveCount}
            description="Requests being handled"
            icon={UserCheck}
            iconClassName="bg-purple-100 text-purple-700"
          />

          <StatCard
            title="Critical"
            value={criticalCount}
            description="Requests requiring attention"
            icon={AlertCircle}
            iconClassName="bg-red-100 text-red-700"
          />
        </div>

        {/* Requests */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Service Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review submitted requests and take
                  administrative action.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search requests..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-64"
                  />
                </div>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">
                    In Progress
                  </option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REOPENED">Reopened</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Loading requests...
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <AlertCircle
                size={36}
                className="text-red-500"
              />

              <h3 className="mt-4 font-semibold text-slate-900">
                Unable to load requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredRequests.length === 0 && (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <CheckCircle2
                  size={38}
                  className="text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-900">
                  No requests found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            )}

          {/* Desktop table */}
          {!loading &&
            !error &&
            filteredRequests.length > 0 && (
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4">Request</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Priority</th>
                      <th className="px-5 py-4">Submitted By</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-900">
                            {request.requestNumber}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-sm font-medium text-slate-700">
                            {request.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(request.createdAt)}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {request.categoryName || "—"}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {request.location || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                              priorityStyles[
                                request.priority
                              ] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {request.priority || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {request.submittedByName || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                              statusStyles[request.status] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {statusLabel[request.status] ||
                              request.status}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-right">
                          <Link
                            to={`/admin/requests/${request.id}`}
                            className="inline-flex items-center rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* Mobile cards */}
          {!loading &&
            !error &&
            filteredRequests.length > 0 && (
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-blue-600">
                          {request.requestNumber}
                        </p>

                        <h3 className="mt-1 font-bold text-slate-900">
                          {request.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          statusStyles[request.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel[request.status] ||
                          request.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">
                          Category
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {request.categoryName || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Priority
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            priorityStyles[
                              request.priority
                            ] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {request.priority || "—"}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-slate-400">
                          Submitted By
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {request.submittedByName || "—"}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {request.location || "—"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/admin/requests/${request.id}`}
                      className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Manage Request
                    </Link>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
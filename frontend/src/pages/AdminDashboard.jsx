import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  RefreshCw,
  Search,
  UserCheck,
  X,
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
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
  MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  CRITICAL: "border-red-200 bg-red-50 text-red-700",
};

const statusStyles = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  REVIEWED: "border-blue-200 bg-blue-50 text-blue-700",
  ASSIGNED: "border-violet-200 bg-violet-50 text-violet-700",
  IN_PROGRESS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CLOSED: "border-slate-200 bg-slate-100 text-slate-600",
  REOPENED: "border-orange-200 bg-orange-50 text-orange-700",
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
  accentClassName,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${accentClassName}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Search size={25} />
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        No requests found
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No service requests match your current search and status filter."
          : "There are no service requests available yet."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <X size={16} />
          Clear filters
        </button>
      )}
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

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;

      const matchesSearch =
        !search ||
        request.requestNumber
          ?.toLowerCase()
          .includes(search) ||
        request.title
          ?.toLowerCase()
          .includes(search) ||
        request.categoryName
          ?.toLowerCase()
          .includes(search) ||
        request.submittedByName
          ?.toLowerCase()
          .includes(search) ||
        request.location
          ?.toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [requests, searchTerm, statusFilter]);

  const hasFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "ALL";

  const handleRefresh = () => {
    setRefreshKey((value) => value + 1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Administration
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor campus service requests, review
                priorities, assign work, and track resolution
                progress.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Pending Review"
            value={pendingCount}
            description="Awaiting administrative review"
            icon={Clock3}
            iconClassName="bg-amber-50 text-amber-700"
            accentClassName="bg-amber-400"
          />

          <StatCard
            title="Reviewed"
            value={reviewedCount}
            description="Priority confirmed by admin"
            icon={CheckCircle2}
            iconClassName="bg-blue-50 text-blue-700"
            accentClassName="bg-blue-500"
          />

          <StatCard
            title="Assigned / Active"
            value={assignedActiveCount}
            description="Currently being handled"
            icon={UserCheck}
            iconClassName="bg-violet-50 text-violet-700"
            accentClassName="bg-violet-500"
          />

          <StatCard
            title="Critical"
            value={criticalCount}
            description="Requests requiring attention"
            icon={AlertCircle}
            iconClassName="bg-red-50 text-red-700"
            accentClassName="bg-red-500"
          />
        </div>

        {/* Request Management */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Section Header */}
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-slate-950">
                    Service Requests
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {filteredRequests.length}
                  </span>
                </div>

                <p className="mt-1.5 text-sm text-slate-500">
                  Review submitted requests and take
                  administrative action.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search requests..."
                    aria-label="Search service requests"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-72"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm("")
                      }
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    aria-label="Filter requests by status"
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-48"
                  >
                    <option value="ALL">
                      All Statuses
                    </option>
                    <option value="PENDING">
                      Pending Review
                    </option>
                    <option value="REVIEWED">
                      Reviewed
                    </option>
                    <option value="ASSIGNED">
                      Assigned
                    </option>
                    <option value="IN_PROGRESS">
                      In Progress
                    </option>
                    <option value="RESOLVED">
                      Resolved
                    </option>
                    <option value="CLOSED">
                      Closed
                    </option>
                    <option value="REOPENED">
                      Reopened
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                <p className="text-xs font-medium text-blue-700">
                  Showing {filteredRequests.length} matching{" "}
                  {filteredRequests.length === 1
                    ? "request"
                    : "requests"}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 transition hover:text-blue-900"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <RefreshCw
                    size={21}
                    className="animate-spin"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading requests...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Fetching the latest administrative data
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle size={27} />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Unable to load requests
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredRequests.length === 0 && (
              <EmptyState
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
              />
            )}

          {/* Desktop table */}
          {!loading &&
            !error &&
            filteredRequests.length > 0 && (
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">
                        Request
                      </th>

                      <th className="px-5 py-4">
                        Category
                      </th>

                      <th className="px-5 py-4">
                        Priority
                      </th>

                      <th className="px-5 py-4">
                        Submitted By
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map(
                      (request) => (
                        <tr
                          key={request.id}
                          className="group transition hover:bg-slate-50/80"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-700">
                                {request.requestNumber
                                  ?.replace(
                                    "USR-",
                                    "",
                                  )
                                  .slice(-2) ||
                                  "—"}
                              </div>

                              <div className="min-w-0">
                                <p className="font-extrabold text-slate-900">
                                  {
                                    request.requestNumber
                                  }
                                </p>

                                <p className="mt-1 max-w-xs truncate text-sm font-semibold text-slate-700">
                                  {request.title}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {formatDate(
                                    request.createdAt,
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="text-sm font-semibold text-slate-700">
                              {request.categoryName ||
                                "—"}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                              {request.location || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold tracking-wide ${
                                priorityStyles[
                                  request.priority
                                ] ||
                                "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {request.priority ||
                                "—"}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <p className="max-w-40 truncate text-sm font-semibold text-slate-700">
                              {request.submittedByName ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${
                                statusStyles[
                                  request.status
                                ] ||
                                "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                              {statusLabel[
                                request.status
                              ] ||
                                request.status}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Link
                              to={`/admin/requests/${request.id}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                            >
                              Manage
                              <ArrowUpRight
                                size={14}
                              />
                            </Link>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Mobile cards */}
          {!loading &&
            !error &&
            filteredRequests.length > 0 && (
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredRequests.map(
                  (request) => (
                    <div
                      key={request.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold tracking-wide text-blue-600">
                            {
                              request.requestNumber
                            }
                          </p>

                          <h3 className="mt-1.5 font-extrabold leading-5 text-slate-900">
                            {request.title}
                          </h3>

                          <p className="mt-1.5 text-xs text-slate-400">
                            {formatDate(
                              request.createdAt,
                            )}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${
                            statusStyles[
                              request.status
                            ] ||
                            "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {statusLabel[
                            request.status
                          ] ||
                            request.status}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 rounded-xl bg-slate-50 p-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Category
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {request.categoryName ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Priority
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${
                              priorityStyles[
                                request.priority
                              ] ||
                              "border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {request.priority ||
                              "—"}
                          </span>
                        </div>

                        <div className="col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Submitted By
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {request.submittedByName ||
                              "—"}
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Location
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {request.location ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/admin/requests/${request.id}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        Manage Request
                        <ChevronRight
                          size={16}
                        />
                      </Link>
                    </div>
                  ),
                )}
              </div>
            )}
        </section>
      </div>
    </div>
  );
}
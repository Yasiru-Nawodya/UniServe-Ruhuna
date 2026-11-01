import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  RefreshCw,
  Search,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statusLabels = {
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
};

const priorityStyles = {
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
  MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  CRITICAL: "border-red-200 bg-red-50 text-red-700",
};

const statusStyles = {
  ASSIGNED: "border-amber-200 bg-amber-50 text-amber-700",
  IN_PROGRESS: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
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
            {label}
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
    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Wrench size={26} />
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        No requests found
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No assigned requests match your current search and status filter."
          : "There are currently no active service requests assigned to you."}
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

export default function ServiceStaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await api.getStaffAssignedRequests();

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load assigned service requests.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await api.getStaffAssignedRequests();

        if (active) {
          setRequests(
            Array.isArray(data) ? data : [],
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Failed to load assigned service requests.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInitialRequests();

    return () => {
      active = false;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        request.requestNumber
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        request.title
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        request.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        request.location
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        request.categoryName
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [requests, search, statusFilter]);

  const totalAssigned = requests.length;

  const awaitingWork = requests.filter(
    (request) => request.status === "ASSIGNED",
  ).length;

  const inProgress = requests.filter(
    (request) => request.status === "IN_PROGRESS",
  ).length;

  const criticalRequests = requests.filter(
    (request) => request.priority === "CRITICAL",
  ).length;

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
                <Wrench size={14} />
                Service Staff Workspace
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Assigned Requests
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Focus on the service requests assigned to
                you, track active work, and resolve issues
                efficiently.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadRequests(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Wrench}
            label="Total Assigned"
            value={totalAssigned}
            description="Active requests assigned to you"
            iconClassName="bg-violet-50 text-violet-700"
            accentClassName="bg-violet-500"
          />

          <StatCard
            icon={Clock3}
            label="Awaiting Work"
            value={awaitingWork}
            description="Requests waiting to be started"
            iconClassName="bg-amber-50 text-amber-700"
            accentClassName="bg-amber-400"
          />

          <StatCard
            icon={CheckCircle2}
            label="In Progress"
            value={inProgress}
            description="Requests currently being handled"
            iconClassName="bg-indigo-50 text-indigo-700"
            accentClassName="bg-indigo-500"
          />

          <StatCard
            icon={AlertCircle}
            label="Critical"
            value={criticalRequests}
            description="Requests requiring urgent attention"
            iconClassName="bg-red-50 text-red-700"
            accentClassName="bg-red-500"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-slate-950">
                    My Active Requests
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {filteredRequests.length}
                  </span>
                </div>

                <p className="mt-1.5 text-sm text-slate-500">
                  Requests currently assigned to your
                  service staff account.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search requests..."
                    aria-label="Search assigned requests"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 sm:w-72"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {[
                    "ALL",
                    "ASSIGNED",
                    "IN_PROGRESS",
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setStatusFilter(status)
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                        statusFilter === status
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:bg-white hover:text-slate-700"
                      }`}
                    >
                      {status === "ALL"
                        ? "All"
                        : statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
                <p className="text-xs font-medium text-violet-700">
                  Showing {filteredRequests.length} matching{" "}
                  {filteredRequests.length === 1
                    ? "request"
                    : "requests"}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 transition hover:text-violet-900"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            )}
          </div>

          {!loading && error && (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-bold">
                  Unable to load requests
                </p>

                <p className="mt-1 leading-6">
                  {error}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <RefreshCw
                    size={21}
                    className="animate-spin"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading assigned requests...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Fetching your latest workload
                </p>
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Request
                      </th>

                      <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Submitted
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
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
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-600 transition group-hover:bg-violet-50 group-hover:text-violet-700">
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

                                <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                                  {request.location ||
                                    "No location"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="text-sm font-semibold text-slate-700">
                              {request.categoryName ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${
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
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${
                                statusStyles[
                                  request.status
                                ] ||
                                "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />

                              {statusLabels[
                                request.status
                              ] ||
                                request.status}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-sm font-medium text-slate-500">
                            {formatDate(
                              request.createdAt,
                            )}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Link
                              to={`/service-staff/requests/${request.id}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700"
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

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredRequests.map(
                  (request) => (
                    <div
                      key={request.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold tracking-wide text-violet-600">
                            {
                              request.requestNumber
                            }
                          </p>

                          <h3 className="mt-1.5 font-extrabold leading-5 text-slate-900">
                            {request.title}
                          </h3>

                          <p className="mt-1.5 text-xs text-slate-400">
                            {request.location ||
                              "No location"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${
                            priorityStyles[
                              request.priority
                            ] ||
                            "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {request.priority ||
                            "—"}
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
                            Status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${
                              statusStyles[
                                request.status
                              ] ||
                              "border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {statusLabels[
                              request.status
                            ] ||
                              request.status}
                          </span>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Submitted
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {formatDate(
                              request.createdAt,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Priority
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {request.priority ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/service-staff/requests/${request.id}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                      >
                        Manage Request
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
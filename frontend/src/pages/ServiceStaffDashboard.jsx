import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statusLabels = {
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const statusStyles = {
  ASSIGNED: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleString();
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
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

      setRequests(data || []);
    } catch (err) {
      setError(
        err.message || "Failed to load assigned service requests.",
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
        const data = await api.getStaffAssignedRequests();

        if (active) {
          setRequests(data || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Failed to load assigned service requests.",
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
    const normalizedSearch = search.trim().toLowerCase();

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <Wrench className="h-4 w-4" />
              Service Staff Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Assigned Requests
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage service requests assigned to you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadRequests(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Wrench}
            label="Total Assigned"
            value={totalAssigned}
            description="Active requests assigned to you"
          />

          <StatCard
            icon={Clock3}
            label="Awaiting Work"
            value={awaitingWork}
            description="Requests waiting to be started"
          />

          <StatCard
            icon={CheckCircle2}
            label="In Progress"
            value={inProgress}
            description="Requests currently being handled"
          />

          <StatCard
            icon={AlertCircle}
            label="Critical"
            value={criticalRequests}
            description="High-priority attention required"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search requests..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex gap-2">
                {["ALL", "ASSIGNED", "IN_PROGRESS"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      statusFilter === status
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

          {error && (
            <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">Unable to load requests</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center p-8">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Loading assigned requests...
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="rounded-full bg-slate-100 p-4">
                <Wrench className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No requests found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {requests.length === 0
                  ? "There are currently no active service requests assigned to you."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Request
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Submitted
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                        <td className="px-5 py-4">
                          <p className="text-xs font-semibold text-blue-600">
                            {request.requestNumber}
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {request.title}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {request.location || "No location"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {request.categoryName || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              priorityStyles[request.priority] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {request.priority || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              statusStyles[request.status] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {statusLabels[request.status] ||
                              request.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(request.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            to={`/staff/requests/${request.id}`}
                            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-blue-600">
                          {request.requestNumber}
                        </p>

                        <h3 className="mt-1 font-semibold text-slate-900">
                          {request.title}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[request.priority] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {request.priority || "—"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">
                          Category
                        </p>
                        <p className="mt-1 text-slate-700">
                          {request.categoryName || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Status
                        </p>
                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[request.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {statusLabels[request.status] ||
                            request.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Location
                        </p>
                        <p className="mt-1 text-slate-700">
                          {request.location || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Submitted
                        </p>
                        <p className="mt-1 text-slate-700">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/staff/requests/${request.id}`}
                      className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Manage Request
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
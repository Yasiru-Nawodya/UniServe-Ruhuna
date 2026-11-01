import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  MapPin,
  PlusCircle,
  Search,
} from "lucide-react";
import api from "../services/api";

const statusConfig = {
  PENDING: {
    label: "Pending",
    style: "bg-amber-50 text-amber-700",
  },
  REVIEWED: {
    label: "Reviewed",
    style: "bg-sky-50 text-sky-700",
  },
  ASSIGNED: {
    label: "Assigned",
    style: "bg-purple-50 text-purple-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    style: "bg-indigo-50 text-indigo-700",
  },
  RESOLVED: {
    label: "Resolved",
    style: "bg-emerald-50 text-emerald-700",
  },
  CLOSED: {
    label: "Closed",
    style: "bg-slate-100 text-slate-600",
  },
};

const priorityConfig = {
  LOW: "text-slate-500",
  MEDIUM: "text-amber-600",
  HIGH: "text-red-600",
  CRITICAL: "text-red-700",
};

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getMyRequests();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Failed to load your requests.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.requestNumber?.toLowerCase().includes(query) ||
        request.title?.toLowerCase().includes(query) ||
        request.categoryName?.toLowerCase().includes(query) ||
        request.location?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const formatDate = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const inProgressCount = requests.filter(
    (request) => request.status === "IN_PROGRESS",
  ).length;

  const resolvedCount = requests.filter(
    (request) =>
      request.status === "RESOLVED" || request.status === "CLOSED",
  ).length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Request Management
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            My Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Track the progress of your campus service requests.
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

      {/* Loading */}
      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-medium text-slate-500">
            Loading your requests...
          </p>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="font-semibold text-red-700">
            Failed to load requests
          </p>

          <p className="mt-1 text-sm text-red-600">{error}</p>
        </section>
      )}

      {!loading && !error && (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Requests
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {requests.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Pending</p>

              <p className="mt-2 text-3xl font-extrabold text-amber-600">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                In Progress
              </p>

              <p className="mt-2 text-3xl font-extrabold text-indigo-600">
                {inProgressCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Resolved</p>

              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {resolvedCount}
              </p>
            </div>
          </div>

          {/* Search and filter */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by request ID, title, category, or location..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 md:w-48"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Request list */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Submitted Requests
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredRequests.length} request
                    {filteredRequests.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredRequests.map((request) => {
                  const status = statusConfig[request.status];

                  return (
                    <div
                      key={request.id}
                      className="p-6 transition hover:bg-slate-50"
                    >
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold tracking-wide text-slate-400">
                              {request.requestNumber}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                status?.style ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {status?.label || request.status}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-bold text-slate-900">
                            {request.title}
                          </h3>

                          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-5">
                            <span>{request.categoryName}</span>

                            <span className="flex items-center gap-1.5">
                              <MapPin size={15} />
                              {request.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={15} />
                              {formatDate(request.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 lg:justify-end">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Priority
                            </p>

                            <p
                              className={`mt-1 text-sm font-bold ${
                                priorityConfig[request.priority] ||
                                "text-slate-600"
                              }`}
                            >
                              {request.priority}
                            </p>
                          </div>

                          <Link
                            to={`/student/requests/${request.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            View Details
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <ClipboardList size={25} />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  No requests found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default MyRequestsPage;
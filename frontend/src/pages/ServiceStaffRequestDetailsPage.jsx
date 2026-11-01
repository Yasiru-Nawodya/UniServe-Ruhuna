import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  PlayCircle,
  RefreshCw,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const statusLabels = {
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

const statusStyles = {
  ASSIGNED: "border-amber-200 bg-amber-50 text-amber-700",
  IN_PROGRESS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const priorityStyles = {
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
  MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  CRITICAL: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {Icon && <Icon size={14} />}
        {label}
      </div>

      <p className="mt-2 text-sm font-semibold leading-5 text-slate-800">
        {value || "Not specified"}
      </p>
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className="absolute left-[7px] top-4 h-full w-px bg-slate-200" />
      )}

      <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-white bg-indigo-500 shadow-sm ring-1 ring-indigo-100" />

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <p className="text-sm font-extrabold text-slate-900">
              {statusLabels[item.status] || item.status}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {item.changedByName || "System"}
            </p>
          </div>

          <p className="shrink-0 text-xs font-medium text-slate-400">
            {formatDate(item.createdAt)}
          </p>
        </div>

        {item.comment && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm leading-6 text-slate-600">
              {item.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiceStaffRequestDetailsPage() {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadInitialRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const [requestData, historyData] = await Promise.all([
          api.getStaffRequest(requestId),
          api.getStaffRequestHistory(requestId),
        ]);

        if (active) {
          setRequest(requestData);
          setHistory(historyData || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load request.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInitialRequest();

    return () => {
      active = false;
    };
  }, [requestId]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      setError("");

      const updatedRequest =
        await api.updateStaffRequestStatus(requestId, {
          status,
          comment: comment.trim() || null,
        });

      setRequest(updatedRequest);
      setComment("");

      const historyData =
        await api.getStaffRequestHistory(requestId);

      setHistory(historyData || []);
    } catch (err) {
      setError(
        err.message || "Failed to update request status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <RefreshCw
              size={21}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading request...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching request details and history
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/staff/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 bg-red-50 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <AlertCircle size={21} />
                </div>

                <div>
                  <h1 className="font-extrabold text-red-900">
                    Request could not be loaded
                  </h1>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error || "Request not found."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canStartWork = request.status === "ASSIGNED";
  const canResolve = request.status === "IN_PROGRESS";
  const isResolved = request.status === "RESOLVED";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Back navigation */}
        <Link
          to="/staff/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-violet-700">
                    {request.requestNumber}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${
                      statusStyles[request.status] ||
                      "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {statusLabels[request.status] ||
                      request.status}
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${
                      priorityStyles[request.priority] ||
                      "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {request.priority || "No Priority"}
                  </span>
                </div>

                <h1 className="mt-4 max-w-3xl text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  {request.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Submitted {formatDate(request.createdAt)}
                </p>
              </div>

              {/* Requester */}
              <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:min-w-64">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  <User size={15} />
                  Submitted By
                </div>

                <p className="mt-2 text-sm font-bold text-slate-900">
                  {request.submittedByName || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-7 lg:mx-8">
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-bold">
                  Operation failed
                </p>

                <p className="mt-1 leading-6">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)] lg:p-8">
            {/* Left column */}
            <div className="min-w-0">
              {/* Request details */}
              <section>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Wrench size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">
                      Request Details
                    </h2>

                    <p className="text-xs text-slate-400">
                      Information provided with this service request
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {request.description ||
                        "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Location"
                    value={request.location}
                    icon={MapPin}
                  />

                  <DetailItem
                    label="Category"
                    value={request.categoryName}
                  />

                  <DetailItem
                    label="Department"
                    value={
                      request.assignedDepartmentName
                    }
                  />

                  <DetailItem
                    label="Last Updated"
                    value={formatDate(
                      request.updatedAt,
                    )}
                    icon={Clock3}
                  />
                </div>
              </section>

              {/* History */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <Clock3 size={18} />
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-950">
                        Request History
                      </h2>

                      <p className="text-xs text-slate-400">
                        Timeline of actions taken on this request
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {history.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <p className="text-sm font-semibold text-slate-500">
                        No history available.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {history.map((item, index) => (
                        <TimelineItem
                          key={`${item.createdAt}-${index}`}
                          item={item}
                          isLast={
                            index === history.length - 1
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div>
              <div className="lg:sticky lg:top-6">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <Wrench size={18} />
                      </div>

                      <div>
                        <h2 className="text-lg font-extrabold text-slate-950">
                          Work Actions
                        </h2>

                        <p className="text-xs text-slate-400">
                          Update the request as you work
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Current status */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Current Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                            statusStyles[request.status] ||
                            "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {statusLabels[request.status] ||
                            request.status}
                        </span>
                      </div>
                    </div>

                    {/* Work note */}
                    {!isResolved && (
                      <div className="mt-5">
                        <label
                          htmlFor="work-comment"
                          className="text-sm font-bold text-slate-700"
                        >
                          Work Note
                        </label>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Add details about the work performed or
                          the action you are taking.
                        </p>

                        <textarea
                          id="work-comment"
                          value={comment}
                          onChange={(event) =>
                            setComment(event.target.value)
                          }
                          rows={6}
                          placeholder="e.g. Inspected the equipment and identified the faulty connection..."
                          disabled={updating}
                          className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 space-y-3">
                      {canStartWork && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus("IN_PROGRESS")
                            }
                            disabled={updating}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updating ? (
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />
                            ) : (
                              <PlayCircle size={18} />
                            )}

                            {updating
                              ? "Starting Work..."
                              : "Start Work"}
                          </button>

                          <p className="text-center text-[11px] leading-5 text-slate-400">
                            Starting work will move this request to
                            <span className="font-bold text-slate-600">
                              {" "}
                              In Progress
                            </span>
                            .
                          </p>
                        </>
                      )}

                      {canResolve && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus("RESOLVED")
                            }
                            disabled={updating}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updating ? (
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2 size={18} />
                            )}

                            {updating
                              ? "Resolving Request..."
                              : "Mark as Resolved"}
                          </button>

                          <p className="text-center text-[11px] leading-5 text-slate-400">
                            Add a work note above before resolving
                            if you want the action recorded in the
                            request history.
                          </p>
                        </>
                      )}

                      {isResolved && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                              <CheckCircle2 size={19} />
                            </div>

                            <div>
                              <p className="text-sm font-extrabold text-emerald-800">
                                Request resolved
                              </p>

                              <p className="mt-1 text-xs leading-5 text-emerald-700">
                                The work has been completed and the
                                request is now waiting for
                                administrative review and closure.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Workflow guide */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Staff Workflow
                  </p>

                  <div className="mt-4 space-y-3">
                    <div
                      className={`flex items-center gap-3 ${
                        request.status === "ASSIGNED"
                          ? "text-violet-700"
                          : "text-slate-400"
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold">
                        1
                      </div>

                      <span className="text-xs font-bold">
                        Assigned
                      </span>
                    </div>

                    <div className="ml-3.5 h-3 w-px bg-slate-200" />

                    <div
                      className={`flex items-center gap-3 ${
                        request.status === "IN_PROGRESS"
                          ? "text-indigo-700"
                          : "text-slate-400"
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold">
                        2
                      </div>

                      <span className="text-xs font-bold">
                        In Progress
                      </span>
                    </div>

                    <div className="ml-3.5 h-3 w-px bg-slate-200" />

                    <div
                      className={`flex items-center gap-3 ${
                        request.status === "RESOLVED"
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold">
                        3
                      </div>

                      <span className="text-xs font-bold">
                        Resolved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
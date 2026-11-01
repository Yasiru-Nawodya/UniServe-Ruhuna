import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
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
  ASSIGNED: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleString();
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
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading request...
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/staff/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Request could not be loaded
                </p>

                <p className="mt-1 text-sm">
                  {error || "Request not found."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canStartWork = request.status === "ASSIGNED";
  const canResolve = request.status === "IN_PROGRESS";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/staff/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">
                    {request.requestNumber}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[request.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {statusLabels[request.status] ||
                      request.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityStyles[request.priority] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {request.priority}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {request.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Submitted {formatDate(request.createdAt)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 lg:min-w-56">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User className="h-4 w-4" />
                  Submitted By
                </div>

                <p className="mt-2 text-sm text-slate-900">
                  {request.submittedByName || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-8">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Operation failed
                </p>

                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-slate-700" />

                <h2 className="text-lg font-bold text-slate-900">
                  Request Details
                </h2>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {request.description ||
                      "No description provided."}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {request.location || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {request.categoryName || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {request.assignedDepartmentName ||
                        "Not assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Last Updated
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {formatDate(request.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-slate-700" />

                  <h2 className="text-lg font-bold text-slate-900">
                    Request History
                  </h2>
                </div>

                {history.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No history available.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {history.map((item, index) => (
                      <div
                        key={`${item.createdAt}-${index}`}
                        className="relative pl-7"
                      >
                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {statusLabels[item.status] ||
                                item.status}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.changedByName || "System"}
                            </p>

                            {item.comment && (
                              <p className="mt-2 text-sm text-slate-600">
                                {item.comment}
                              </p>
                            )}
                          </div>

                          <p className="text-xs text-slate-400">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Work Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the request as you work on it.
                </p>

                <div className="mt-5">
                  <label
                    htmlFor="work-comment"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Work Note
                  </label>

                  <textarea
                    id="work-comment"
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    rows={5}
                    placeholder="Add a note about the work performed..."
                    disabled={
                      updating ||
                      request.status === "RESOLVED"
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {canStartWork && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus("IN_PROGRESS")
                      }
                      disabled={updating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}

                      Start Work
                    </button>
                  )}

                  {canResolve && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus("RESOLVED")
                      }
                      disabled={updating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}

                      Mark as Resolved
                    </button>
                  )}

                  {request.status === "RESOLVED" && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Request resolved
                          </p>

                          <p className="mt-1 text-xs leading-5 text-emerald-700">
                            The request has been marked as
                            resolved. An administrator can now
                            review and close the request.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
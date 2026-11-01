import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import api from "../services/api";

function AdminRequestDetailsPage() {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);

  const [priority, setPriority] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [closureComment, setClosureComment] = useState("");

  const [departments, setDepartments] = useState([]);
  const [serviceStaff, setServiceStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [closing, setClosing] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          requestData,
          historyData,
          departmentData,
          staffData,
        ] = await Promise.all([
          api.getAdminRequest(requestId),
          api.getAdminRequestHistory(requestId),
          api.getDepartments(),
          api.getAdminServiceStaff(),
        ]);

        if (!cancelled) {
          setRequest(requestData);

          setHistory(
            Array.isArray(historyData)
              ? historyData
              : [],
          );

          setDepartments(
            Array.isArray(departmentData)
              ? departmentData.filter(
                  (department) => department.active,
                )
              : [],
          );

          setServiceStaff(
            Array.isArray(staffData)
              ? staffData
              : [],
          );

          setPriority(
            requestData.priority || "MEDIUM",
          );

          setDepartmentId(
            requestData.assignedDepartmentId
              ? String(requestData.assignedDepartmentId)
              : "",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Failed to load the service request.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRequest();

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityStyle = (value) => {
    switch (value) {
      case "CRITICAL":
        return "border-red-200 bg-red-50 text-red-700";

      case "HIGH":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "MEDIUM":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "LOW":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "REVIEWED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "ASSIGNED":
        return "border-violet-200 bg-violet-50 text-violet-700";

      case "IN_PROGRESS":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";

      case "RESOLVED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "CLOSED":
        return "border-slate-200 bg-slate-100 text-slate-700";

      case "REOPENED":
        return "border-orange-200 bg-orange-50 text-orange-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  const refreshRequestData = async () => {
    const [requestData, historyData] =
      await Promise.all([
        api.getAdminRequest(requestId),
        api.getAdminRequestHistory(requestId),
      ]);

    setRequest(requestData);

    setHistory(
      Array.isArray(historyData)
        ? historyData
        : [],
    );

    setPriority(
      requestData.priority || "MEDIUM",
    );

    setDepartmentId(
      requestData.assignedDepartmentId
        ? String(requestData.assignedDepartmentId)
        : "",
    );
  };

  const handleReview = async () => {
    try {
      setReviewing(true);
      setError("");
      setActionMessage("");

      await api.updateAdminRequestStatus(
        requestId,
        {
          status: "REVIEWED",
          comment:
            "Request reviewed and priority confirmed by admin.",
        },
      );

      await refreshRequestData();

      setActionMessage(
        "Request reviewed successfully.",
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to review the request.",
      );
    } finally {
      setReviewing(false);
    }
  };

  const handleAssign = async () => {
    if (!departmentId) {
      setError(
        "Please select a department before assigning the request.",
      );
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setActionMessage("");

      await api.assignAdminRequest(
        requestId,
        {
          departmentId: Number(departmentId),
          assignedToId: assignedToId
            ? Number(assignedToId)
            : null,
        },
      );

      await refreshRequestData();

      setActionMessage(
        "Request assigned successfully.",
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to assign the request.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = async () => {
    try {
      setClosing(true);
      setError("");
      setActionMessage("");

      await api.updateAdminRequestStatus(
        requestId,
        {
          status: "CLOSED",
          comment:
            closureComment.trim() ||
            "Request reviewed and closed by admin.",
        },
      );

      await refreshRequestData();

      setClosureComment("");

      setActionMessage(
        "Request closed successfully.",
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to close the request.",
      );
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Loader2
              size={26}
              className="mx-auto animate-spin text-blue-700"
            />

            <p className="mt-4 font-medium text-slate-700">
              Loading request...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/admin/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  const isPending =
    request.status === "PENDING";

  const isReviewed =
    request.status === "REVIEWED";

  const isResolved =
    request.status === "RESOLVED";

  const isAssignable =
    isReviewed;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                  {request.requestNumber}
                </span>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                    request.status,
                  )}`}
                >
                  {request.status?.replace(
                    "_",
                    " ",
                  )}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 lg:text-4xl">
                {request.title}
              </h1>

              <p className="mt-2 text-slate-500">
                Review and manage this campus service request.
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center rounded-xl border px-4 py-3 text-sm font-bold ${getPriorityStyle(
                request.priority,
              )}`}
            >
              Priority: {request.priority}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {actionMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Request Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Submitted service request details
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {request.categoryName || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {request.assignedDepartmentName ||
                      "Not assigned"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-slate-800">
                    <MapPin
                      size={17}
                      className="text-slate-400"
                    />

                    <span className="font-medium">
                      {request.location || "—"}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 leading-7 text-slate-600">
                    {request.description ||
                      "No description provided."}
                  </p>
                </div>
              </div>
            </section>

            {/* History */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Request History
                  </h2>

                  <p className="text-sm text-slate-500">
                    Administrative activity and status changes
                  </p>
                </div>
              </div>

              {history.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  No history available yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {history.map((item, index) => (
                    <div
                      key={
                        item.id ||
                        `${item.createdAt}-${index}`
                      }
                      className="flex gap-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <CheckCircle2 size={17} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row">
                          <p className="font-semibold text-slate-800">
                            {item.status?.replace(
                              "_",
                              " ",
                            ) ||
                              "Status Updated"}
                          </p>

                          <span className="text-xs text-slate-400">
                            {formatDate(
                              item.createdAt,
                            )}
                          </span>
                        </div>

                        {item.changedByName && (
                          <p className="mt-1 text-sm text-slate-500">
                            Updated by{" "}
                            {item.changedByName}
                          </p>
                        )}

                        {(item.comment ||
                          item.note) && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.comment ||
                              item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Submitted By */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Submitted By
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <User size={20} />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {request.submittedByName ||
                      "—"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Requester
                  </p>
                </div>
              </div>
            </section>

            {/* Dates */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Request Dates
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-0.5 text-slate-400"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Submitted
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(
                        request.createdAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock3
                    size={18}
                    className="mt-0.5 text-slate-400"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(
                        request.updatedAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin Action */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">
                  Administrative Action
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review, prioritize, assign, and close
                  this service request.
                </p>
              </div>

              {/* Review */}
              {isPending && (
                <>
                  <label
                    htmlFor="priority"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm Priority
                  </label>

                  <select
                    id="priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  >
                    <option value="LOW">
                      Low
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={handleReview}
                    disabled={reviewing}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewing ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Mark as Reviewed
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Assignment */}
              {isAssignable && (
                <div
                  className={
                    isPending
                      ? "mt-6 border-t border-slate-200 pt-6"
                      : ""
                  }
                >
                  <div className="mb-4 flex items-center gap-2">
                    <UserCheck
                      size={19}
                      className="text-violet-700"
                    />

                    <h3 className="font-bold text-slate-900">
                      Assign Request
                    </h3>
                  </div>

                  <label
                    htmlFor="department"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Department
                  </label>

                  <select
                    id="department"
                    value={departmentId}
                    onChange={(event) =>
                      setDepartmentId(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
                  >
                    <option value="">
                      Select department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.name}
                        </option>
                      ),
                    )}
                  </select>

                  <label
                    htmlFor="serviceStaff"
                    className="mb-2 mt-4 block text-sm font-semibold text-slate-700"
                  >
                    Service Staff
                  </label>

                  <select
                    id="serviceStaff"
                    value={assignedToId}
                    onChange={(event) =>
                      setAssignedToId(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
                  >
                    <option value="">
                      Select service staff
                    </option>

                    {serviceStaff.map(
                      (staff) => (
                        <option
                          key={staff.id}
                          value={staff.id}
                        >
                          {staff.fullName}
                        </option>
                      ),
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={
                      assigning ||
                      !departmentId
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {assigning ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserCheck size={17} />
                        Assign Request
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Assigned */}
              {request.status ===
                "ASSIGNED" && (
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <div className="flex items-center gap-2 text-violet-700">
                    <CheckCircle2 size={18} />

                    <p className="font-semibold">
                      Request assigned
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-violet-700/80">
                    This request has been assigned
                    and is ready for service staff
                    processing.
                  </p>
                </div>
              )}

              {/* Resolved / Close */}
              {isResolved && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={18} />

                    <p className="font-semibold">
                      Request resolved
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-emerald-700/80">
                    The service staff member has
                    marked this request as resolved.
                    Review the resolution and close
                    the request if the issue has been
                    satisfactorily addressed.
                  </p>

                  <label
                    htmlFor="closureComment"
                    className="mb-2 mt-5 block text-sm font-semibold text-emerald-900"
                  >
                    Closure Note
                  </label>

                  <textarea
                    id="closureComment"
                    value={closureComment}
                    onChange={(event) =>
                      setClosureComment(
                        event.target.value,
                      )
                    }
                    rows={3}
                    placeholder="Optional closure note..."
                    className="w-full resize-none rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                  />

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={closing}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {closing ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Closing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Close Request
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Closed */}
              {request.status ===
                "CLOSED" && (
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={18} />

                    <p className="font-semibold">
                      Request closed
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    This service request has completed
                    the administrative workflow and is
                    now closed.
                  </p>
                </div>
              )}

              <Link
                to="/admin/dashboard"
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Requests
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default AdminRequestDetailsPage;
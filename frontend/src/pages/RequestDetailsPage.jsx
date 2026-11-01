import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";
import api from "../services/api";

const statusLabels = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  REOPENED: "Reopened",
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const getPriorityClasses = (priority) => {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-50 text-red-700";
    case "HIGH":
      return "bg-orange-50 text-orange-700";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700";
    case "LOW":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-50 text-slate-600";
  }
};

const getTimelineDescription = (status) => {
  switch (status) {
    case "PENDING":
      return "Your service request was submitted and is waiting for administrative review.";

    case "REVIEWED":
      return "The request was reviewed by the administration.";

    case "ASSIGNED":
      return "The request was assigned to the appropriate service team.";

    case "IN_PROGRESS":
      return "Service staff are currently working on the issue.";

    case "RESOLVED":
      return "The reported issue has been resolved.";

    case "CLOSED":
      return "The request has been completed and closed.";

    case "REOPENED":
      return "The request was reopened for further attention.";

    default:
      return "The request status was updated.";
  }
};

function RequestDetailsPage() {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadRequestDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [requestData, historyData] = await Promise.all([
          api.getRequest(requestId),
          api.getRequestHistory(requestId),
        ]);

        if (!isMounted) {
          return;
        }

        setRequest(requestData);
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError?.message ||
            "Unable to load the requested service request."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRequestDetails();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const timeline = useMemo(() => {
    if (!request) {
      return [];
    }

    const historyEvents = history.map((event) => {
      const dateTime = formatDateTime(event.createdAt);

      return {
        status: event.status,
        title: statusLabels[event.status] || event.status,
        description:
          event.comment ||
          getTimelineDescription(event.status),
        date: dateTime?.date || null,
        time: dateTime?.time || null,
        completed: true,
        current: event.status === request.status,
      };
    });

    const hasCurrentStatus = historyEvents.some(
      (event) => event.status === request.status
    );

    if (!hasCurrentStatus && request.status) {
      const dateTime = formatDateTime(request.updatedAt);

      historyEvents.push({
        status: request.status,
        title: statusLabels[request.status] || request.status,
        description: getTimelineDescription(request.status),
        date: dateTime?.date || null,
        time: dateTime?.time || null,
        completed: true,
        current: true,
      });
    }

    return historyEvents;
  }, [history, request]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Loading Request
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Retrieving the latest request information.
          </p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Request Not Found
          </h1>

          <p className="mt-3 text-slate-500">
            {error || "The requested service request could not be found."}
          </p>

          <Link
            to="/student/requests"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Back to My Requests
          </Link>
        </div>
      </div>
    );
  }

  const submittedDate = formatDate(request.createdAt);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link
        to="/student/requests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
      >
        <ArrowLeft size={17} />
        Back to My Requests
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold tracking-wider text-slate-400">
                {request.requestNumber}
              </span>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {statusLabels[request.status] || request.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                  request.priority
                )}`}
              >
                {request.priority} Priority
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              {request.title}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              {request.description}
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-slate-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Submitted
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CalendarDays size={16} />
              {submittedDate || "—"}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {request.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <UserRound size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Assigned Department
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {request.assignedDepartmentName || "Not assigned yet"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Request Progress
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Status Timeline
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Follow the progress of your service request from submission to
            completion.
          </p>
        </div>

        <div className="mt-8">
          {timeline.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              No status history is available yet.
            </div>
          ) : (
            timeline.map((event, index) => {
              const isLast = index === timeline.length - 1;

              return (
                <div key={`${event.status}-${index}`} className="relative flex gap-5">
                  {!isLast && (
                    <div
                      className={`absolute left-[15px] top-9 h-[calc(100%-12px)] w-0.5 ${
                        event.completed ? "bg-blue-200" : "bg-slate-200"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      event.current
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : event.completed
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {event.completed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Clock3 size={17} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-9">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <h3
                        className={`font-bold ${
                          event.current
                            ? "text-blue-700"
                            : "text-slate-900"
                        }`}
                      >
                        {event.title}
                      </h3>

                      {event.date && (
                        <p className="text-xs font-medium text-slate-400">
                          {event.date} · {event.time}
                        </p>
                      )}
                    </div>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="font-bold text-slate-900">Request Information</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {request.categoryName}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Requester
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {request.submittedByName}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RequestDetailsPage;
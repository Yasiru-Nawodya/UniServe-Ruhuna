import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

const requestData = {
  "USR-1001": {
    id: "USR-1001",
    title: "Projector not working",
    category: "Classroom Equipment",
    location: "Lecture Hall 03",
    priority: "High",
    status: "IN_PROGRESS",
    submittedDate: "20 Oct 2026",
    description:
      "The projector does not turn on and the lecture cannot be displayed properly. The issue was noticed before the morning lecture.",
    assignedTeam: "Classroom Equipment Services",
    timeline: [
      {
        title: "Request Submitted",
        description: "Your service request was successfully submitted.",
        date: "20 Oct 2026",
        time: "09:42 AM",
        completed: true,
      },
      {
        title: "Request Reviewed",
        description: "The request was reviewed by the administration.",
        date: "20 Oct 2026",
        time: "11:15 AM",
        completed: true,
      },
      {
        title: "Request Assigned",
        description:
          "The request was assigned to the Classroom Equipment Services team.",
        date: "20 Oct 2026",
        time: "01:30 PM",
        completed: true,
      },
      {
        title: "Work In Progress",
        description: "Service staff are currently working on the issue.",
        date: "21 Oct 2026",
        time: "09:10 AM",
        completed: true,
        current: true,
      },
      {
        title: "Resolved",
        description: "The reported issue has been fixed.",
        date: null,
        time: null,
        completed: false,
      },
      {
        title: "Closed",
        description: "The request is completed and closed.",
        date: null,
        time: null,
        completed: false,
      },
    ],
  },

  "USR-1002": {
    id: "USR-1002",
    title: "Wi-Fi connection issue",
    category: "IT & Network",
    location: "Engineering Lab 02",
    priority: "Medium",
    status: "PENDING",
    submittedDate: "18 Oct 2026",
    description:
      "The wireless connection is unstable and disconnects repeatedly while accessing university resources.",
    assignedTeam: "IT & Network Services",
    timeline: [
      {
        title: "Request Submitted",
        description: "Your service request was successfully submitted.",
        date: "18 Oct 2026",
        time: "10:20 AM",
        completed: true,
      },
      {
        title: "Request Reviewed",
        description: "The request is waiting for administrative review.",
        date: null,
        time: null,
        completed: false,
      },
      {
        title: "Request Assigned",
        description: "A service team will be assigned after review.",
        date: null,
        time: null,
        completed: false,
      },
      {
        title: "Work In Progress",
        description: "Service staff will investigate the reported issue.",
        date: null,
        time: null,
        completed: false,
      },
      {
        title: "Resolved",
        description: "The reported issue has been fixed.",
        date: null,
        time: null,
        completed: false,
      },
      {
        title: "Closed",
        description: "The request is completed and closed.",
        date: null,
        time: null,
        completed: false,
      },
    ],
  },
};

const statusLabels = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

function RequestDetailsPage() {
  const { requestId } = useParams();

  const request = requestData[requestId];

  if (!request) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Request Not Found
          </h1>

          <p className="mt-3 text-slate-500">
            The requested service request could not be found.
          </p>

          <Link
            to="/student/requests"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Back to My Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Back navigation */}
      <Link
        to="/student/requests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
      >
        <ArrowLeft size={17} />
        Back to My Requests
      </Link>

      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold tracking-wider text-slate-400">
                {request.id}
              </span>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {statusLabels[request.status]}
              </span>

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
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
              {request.submittedDate}
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
                Assigned Team
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {request.assignedTeam}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
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
          {request.timeline.map((event, index) => {
            const isLast = index === request.timeline.length - 1;

            return (
              <div key={event.title} className="relative flex gap-5">
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
                          : event.completed
                            ? "text-slate-900"
                            : "text-slate-400"
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
          })}
        </div>
      </section>

      {/* Future actions */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="font-bold text-slate-900">Request Actions</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Additional actions such as adding comments, providing feedback, or
          reopening an eligible request will become available as the request
          progresses through the system.
        </p>
      </section>
    </div>
  );
}

export default RequestDetailsPage;
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Clock3,
  Info,
  RefreshCw,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import api from "../services/api";

const getNotificationIcon = (notification) => {
  const text =
    `${notification.title || ""} ${notification.message || ""}`.toLowerCase();

  if (
    text.includes("assigned") ||
    text.includes("service staff") ||
    text.includes("work")
  ) {
    return Wrench;
  }

  if (
    text.includes("resolved") ||
    text.includes("closed") ||
    text.includes("completed")
  ) {
    return CheckCheck;
  }

  if (
    text.includes("urgent") ||
    text.includes("critical") ||
    text.includes("priority")
  ) {
    return AlertCircle;
  }

  if (
    text.includes("security") ||
    text.includes("admin") ||
    text.includes("account")
  ) {
    return ShieldCheck;
  }

  if (text.includes("reminder") || text.includes("pending")) {
    return Clock3;
  }

  return Info;
};

const getNotificationStyle = (notification) => {
  const text =
    `${notification.title || ""} ${notification.message || ""}`.toLowerCase();

  if (
    text.includes("resolved") ||
    text.includes("closed") ||
    text.includes("completed")
  ) {
    return {
      icon: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700",
    };
  }

  if (
    text.includes("urgent") ||
    text.includes("critical") ||
    text.includes("priority")
  ) {
    return {
      icon: "bg-red-50 text-red-600",
      badge: "bg-red-50 text-red-700",
    };
  }

  if (text.includes("assigned") || text.includes("service staff")) {
    return {
      icon: "bg-blue-50 text-blue-600",
      badge: "bg-blue-50 text-blue-700",
    };
  }

  return {
    icon: "bg-slate-100 text-slate-600",
    badge: "bg-slate-100 text-slate-700",
  };
};

const formatDate = (value) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      setError("");

      const data = await api.getNotifications();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Unable to load notifications. Please try again.",
      );
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    api
      .getNotifications()
      .then((data) => {
        if (!controller.signal.aborted) {
          setNotifications(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err.message ||
              "Unable to load notifications. Please try again.",
          );
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read,
    ).length;
  }, [notifications]);

  const handleMarkAsRead = async (notification) => {
    if (notification.read) {
      return;
    }

    try {
      setError("");

      await api.markNotificationRead(notification.id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item,
        ),
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to mark this notification as read.",
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      setError("");

      await Promise.all(
        unreadNotifications.map((notification) =>
          api.markNotificationRead(notification.id),
        ),
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to mark all notifications as read.",
      );
    }
  };

  const handleRefresh = async () => {
    await loadNotifications(true);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
              <Bell className="h-3.5 w-3.5" />
              Notification Center
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Stay up to date
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              View important updates about your service requests,
              assignments, progress, and completed work.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total notifications
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {notifications.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Unread notifications
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading notifications...
          </div>
        </section>
      )}

      {!loading && notifications.length === 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Bell className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No notifications yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You&apos;ll see updates here when there is activity on
            your service requests.
          </p>
        </section>
      )}

      {!loading && notifications.length > 0 && (
        <section className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification);
            const styles = getNotificationStyle(notification);
            const isUnread = !notification.read;

            return (
              <article
                key={notification.id}
                onClick={() => handleMarkAsRead(notification)}
                className={`group cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isUnread
                    ? "border-blue-200 bg-blue-50/20"
                    : "border-slate-200"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-slate-900">
                            {notification.title ||
                              "Notification"}
                          </h2>

                          {isUnread && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {notification.message ||
                            "You have a new notification."}
                        </p>
                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                      >
                        {isUnread ? "Unread" : "Read"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                      <span>
                        {formatDate(
                          notification.createdAt ||
                            notification.timestamp,
                        )}
                      </span>

                      {notification.requestNumber && (
                        <span className="font-medium text-slate-500">
                          Request {notification.requestNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default NotificationsPage;
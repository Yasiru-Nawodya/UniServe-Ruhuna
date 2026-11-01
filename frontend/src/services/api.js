const API_BASE_URL = "http://localhost:8082/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${response.status})`,
    );
  }

  return data;
};

export const api = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

      getStaffAssignedRequests: () =>
    request("/staff/requests/assigned"),

  getStaffRequest: (id) =>
    request(`/staff/requests/${id}`),

  getStaffRequestHistory: (id) =>
    request(`/staff/requests/${id}/history`),

  updateStaffRequestStatus: (id, data) =>
    request(`/staff/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getMyRequests: () => request("/requests/my"),

  getRequest: (id) => request(`/requests/${id}`),

  getRequestHistory: (id) =>
    request(`/requests/${id}/history`),

  createRequest: (data) =>
    request("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNotifications: () => request("/notifications"),

  getUnreadNotificationCount: () =>
    request("/notifications/unread/count"),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

    getDepartments: () =>
  request("/departments"),

  getAdminPendingRequests: () =>
    request("/admin/requests/pending"),

  getAdminRequests: () =>
  request("/admin/requests"),

  getAdminServiceStaff: () =>
  request("/admin/requests/service-staff"),

  getAdminRequest: (id) =>
    request(`/admin/requests/${id}`),
  

  getAdminRequestHistory: (id) =>
    request(`/admin/requests/${id}/history`),

  updateAdminRequestStatus: (id, data) =>
    request(`/admin/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  assignAdminRequest: (id, data) =>
    request(`/admin/requests/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export default api;
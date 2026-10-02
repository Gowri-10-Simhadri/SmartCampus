// Centralized API configuration and client
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token =
    options.token !== undefined
      ? options.token
      : typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(
        `Server returned status ${response.status} (${response.statusText}). Check API backend.`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        // Expired or invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// API methods
export const api = {
  baseUrl: API_BASE_URL,

  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    register: (userData: { name: string; email: string; password: string }) =>
      apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),

    me: () => apiRequest("/api/auth/me"),

    updateProfile: (data: { name?: string; password?: string }) =>
      apiRequest("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  complaints: {
    getMy: (params?: {
      search?: string;
      status?: string;
      category?: string;
      priority?: string;
      sort?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.status && params.status !== "All")
        query.append("status", params.status);
      if (params?.category && params.category !== "All")
        query.append("category", params.category);
      if (params?.priority && params.priority !== "All")
        query.append("priority", params.priority);
      if (params?.sort) query.append("sort", params.sort);

      const qs = query.toString();
      return apiRequest(`/api/complaints/my${qs ? `?${qs}` : ""}`);
    },

    getById: (id: string) => apiRequest(`/api/complaints/${id}`),

    create: (data: {
      title: string;
      description: string;
      category: string;
      location?: string;
      priority?: string;
      imageUrl?: string;
    }) =>
      apiRequest("/api/complaints", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getNotifications: () => apiRequest("/api/complaints/notifications"),

    markNotificationRead: (id: string) =>
      apiRequest(`/api/complaints/notifications/${id}/read`, {
        method: "PATCH",
      }),

    markAllNotificationsRead: () =>
      apiRequest("/api/complaints/notifications/read-all", {
        method: "PATCH",
      }),
  },

  admin: {
    getStats: () => apiRequest("/api/admin/stats"),

    getComplaints: (params?: {
      search?: string;
      status?: string;
      category?: string;
      priority?: string;
      sort?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.status && params.status !== "All")
        query.append("status", params.status);
      if (params?.category && params.category !== "All")
        query.append("category", params.category);
      if (params?.priority && params.priority !== "All")
        query.append("priority", params.priority);
      if (params?.sort) query.append("sort", params.sort);

      const qs = query.toString();
      return apiRequest(`/api/admin/complaints${qs ? `?${qs}` : ""}`);
    },

    getComplaintById: (id: string) => apiRequest(`/api/admin/complaints/${id}`),

    updateStatus: (
      id: string,
      data: { status: string; comment?: string; resolutionNotes?: string }
    ) =>
      apiRequest(`/api/admin/complaints/${id}/status`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    assign: (id: string, data: { assignedTo: string; comment?: string }) =>
      apiRequest(`/api/admin/complaints/${id}/assign`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};

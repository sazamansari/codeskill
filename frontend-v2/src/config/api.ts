import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("codeskill_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("codeskill_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  registerSendOTP: (data: { email: string }) => api.post("/auth/register/send-otp", data),
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  adminLogin: (data: any) => api.post("/auth/admin-login", data),
  adminLoginVerify: (data: { email: string; otp: string }) => api.post("/auth/admin-login/verify", data),
  googleLogin: (token: string) => api.post("/auth/google", { token }),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: any) => api.put("/auth/profile", data),
  saveNote: (problemId: string, note: string) => api.put(`/auth/notes/${problemId}`, { note }),
  toggleBookmark: (problemId: string) => api.put(`/auth/bookmark/${problemId}`),
  forgotPassword: (data: { email: string }) => api.post("/auth/forgot-password", data),
  resetPassword: (data: any) => api.post("/auth/reset-password", data),
};

// ── Public Problems ──
export const problemsAPI = {
  getAll: (page = 1, limit = 20, search = "", category = "All Topics") => {
    let url = `/problems?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category && category !== "All Topics") url += `&category=${encodeURIComponent(category)}`;
    return api.get(url);
  },
  getBySlug: (slug: string) => api.get(`/problems/${slug}`),
};

// ── Submissions ──
export const submissionAPI = {
  submit: (data: any) => 
    api.post("/submissions", data),
  getSubmissions: (problemId: number) => api.get(`/submissions/problem/${problemId}`),
};

export const runAPI = {
  run: (data: { code: string; language: string; testCases: any[] }) => api.post("/run", data),
};

// ── Admin ──
export const adminProblemsAPI = {
  getAll: () => api.get("/admin/problems"),
  getById: (id: string) => api.get(`/admin/problems/${id}`),
  create: (data: any) => api.post("/admin/problems", data),
  update: (id: string, data: any) => api.put(`/admin/problems/${id}`, data),
  delete: (id: string) => api.delete(`/admin/problems/${id}`),
};

export const adminContestsAPI = {
  getAll: () => api.get("/admin/contests"),
  getById: (id: string) => api.get(`/admin/contests/${id}`),
  create: (data: any) => api.post("/admin/contests", data),
  update: (id: string, data: any) => api.put(`/admin/contests/${id}`, data),
  delete: (id: string) => api.delete(`/admin/contests/${id}`),
};

export default api;

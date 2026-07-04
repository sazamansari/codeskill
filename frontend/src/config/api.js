import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codeskill_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("codeskill_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  saveNote: (problemId, note) => api.put(`/auth/notes/${problemId}`, { note }),
  toggleBookmark: (problemId) => api.put(`/auth/bookmark/${problemId}`),
};

// ── Submissions ──
export const submissionAPI = {
  submit: (data) => api.post("/submissions", data),
  getForProblem: (problemId) => api.get(`/submissions/problem/${problemId}`),
  getRecent: () => api.get("/submissions/recent"),
  getStats: () => api.get("/submissions/stats"),
};

export default api;

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request and fix URL resolution
api.interceptors.request.use((config) => {
  // Normalize URL resolution:
  // If baseURL does not end with a slash, append it.
  if (config.baseURL && !config.baseURL.endsWith("/")) {
    config.baseURL += "/";
  }
  // If the request URL starts with a slash, remove it so it appends correctly to baseURL.
  if (config.url && config.url.startsWith("/")) {
    config.url = config.url.substring(1);
  }

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
  uploadAvatar: (formData: FormData) => api.post("/auth/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  saveNote: (problemId: string, note: string) => api.put(`/auth/notes/${problemId}`, { note }),
  toggleBookmark: (problemId: string) => api.put(`/auth/bookmark/${problemId}`),
  forgotPassword: (data: { email: string }) => api.post("/auth/forgot-password", data),
  resetPassword: (data: any) => api.post("/auth/reset-password", data),
};

export const usersAPI = {
  getPublicProfile: (identifier: string) => api.get(`/users/${identifier}`),
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
  run: (data: { code: string; language: string; testCases: any[] }) => api.post("/execution/run", data),
};

// ── Discussions ──
export const discussionsAPI = {
  getThreads: (problemId: string, params?: { page?: number; sort?: string; tag?: string }) =>
    api.get(`/discussions/problem/${problemId}`, { params }),
  getThread: (threadId: string) => api.get(`/discussions/${threadId}`),
  createThread: (data: { problemId: string; title: string; body: string; tags?: string[] }) =>
    api.post("/discussions", data),
  deleteThread: (threadId: string) => api.delete(`/discussions/${threadId}`),
  voteThread: (threadId: string, direction: "up" | "down") =>
    api.put(`/discussions/${threadId}/vote`, { direction }),
  getReplies: (threadId: string) => api.get(`/discussions/${threadId}/replies`),
  createReply: (threadId: string, data: { body: string; parentReply?: string }) =>
    api.post(`/discussions/${threadId}/replies`, data),
  deleteReply: (replyId: string) => api.delete(`/discussions/replies/${replyId}`),
  voteReply: (replyId: string, direction: "up" | "down") =>
    api.put(`/discussions/replies/${replyId}/vote`, { direction }),
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

export const adminUsersAPI = {
  getAll: (search = "", adminsOnly = false) => api.get(`/admin/users?search=${encodeURIComponent(search)}&adminsOnly=${adminsOnly}`),
  getReport: (userId: string) => api.get(`/admin/users/${userId}/report`),
  promote: (userId: string) => api.put(`/admin/users/${userId}/promote`),
  demote: (userId: string) => api.put(`/admin/users/${userId}/demote`),
};

export const adminCompaniesAPI = {
  getAll: (search = "") => api.get(`/admin/companies?search=${encodeURIComponent(search)}`),
  toggleVerify: (id: string) => api.put(`/admin/companies/${id}/verify`),
  delete: (id: string) => api.delete(`/admin/companies/${id}`),
};

export const adminUniversitiesAPI = {
  getAll: (search = "") => api.get(`/admin/universities?search=${encodeURIComponent(search)}`),
  toggleVerify: (id: string) => api.put(`/admin/universities/${id}/verify`),
  delete: (id: string) => api.delete(`/admin/universities/${id}`),
};

export const adminDashboardAPI = {
  getStats: () => api.get("/admin/dashboard/stats"),
};

export const companyAPI = {
  register: (data: any) => api.post("/company", data),
  getMyCompanies: () => api.get("/company/my-companies"),
  getCompany: (id: string) => api.get(`/company/${id}`, { headers: { "X-Company-ID": id } }),
  updateCompany: (id: string, data: any) => api.put(`/company/${id}`, data, { headers: { "X-Company-ID": id } }),
};

export const companyJobsAPI = {
  getAll: (companyId: string) => api.get("/company/jobs", { headers: { "X-Company-ID": companyId } }),
  create: (companyId: string, data: any) => api.post("/company/jobs", data, { headers: { "X-Company-ID": companyId } }),
  update: (companyId: string, jobId: string, data: any) => api.put(`/company/jobs/${jobId}`, data, { headers: { "X-Company-ID": companyId } }),
  delete: (companyId: string, jobId: string) => api.delete(`/company/jobs/${jobId}`, { headers: { "X-Company-ID": companyId } }),
};

export const companyTeamAPI = {
  getAll: (companyId: string) => api.get("/company/team", { headers: { "X-Company-ID": companyId } }),
  invite: (companyId: string, data: any) => api.post("/company/team/invite", data, { headers: { "X-Company-ID": companyId } }),
  remove: (companyId: string, userId: string) => api.delete(`/company/team/${userId}`, { headers: { "X-Company-ID": companyId } }),
};

export const companyApplicationsAPI = {
  getAll: (companyId: string) => api.get("/company/applications", { headers: { "X-Company-ID": companyId } }),
  updateStage: (companyId: string, id: string, stage: string) => api.put(`/company/applications/${id}/stage`, { stage }, { headers: { "X-Company-ID": companyId } }),
  generateMock: (companyId: string) => api.post("/company/applications/mock", {}, { headers: { "X-Company-ID": companyId } }),
};

export const campusAPI = {
  register: (data: any) => api.post("/campus", data),
  getMyUniversities: () => api.get("/campus/my-universities"),
  getUniversity: (id: string) => api.get(`/campus/${id}`, { headers: { "X-University-ID": id } }),
  updateUniversity: (id: string, data: any) => api.put(`/campus/${id}`, data, { headers: { "X-University-ID": id } }),
};

export const campusBatchesAPI = {
  getAll: (universityId: string) => api.get("/campus/batches", { headers: { "X-University-ID": universityId } }),
  create: (universityId: string, data: any) => api.post("/campus/batches", data, { headers: { "X-University-ID": universityId } }),
  getStudents: (universityId: string, batchId: string) => api.get(`/campus/batches/${batchId}/students`, { headers: { "X-University-ID": universityId } }),
  delete: (universityId: string, batchId: string) => api.delete(`/campus/batches/${batchId}`, { headers: { "X-University-ID": universityId } }),
};

export const campusStudentsAPI = {
  getAll: (universityId: string) => api.get("/campus/students", { headers: { "X-University-ID": universityId } }),
  generateMock: (universityId: string) => api.post("/campus/students/mock", {}, { headers: { "X-University-ID": universityId } }),
};

export default api;

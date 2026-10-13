import axios from "axios";

const TOKEN_KEY = "sms_token";
const USER_KEY = "sms_user";

// ---- session storage helpers ----
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const saveSession = ({ token, name, email }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ name, email }));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ---- axios instance ----
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is missing/expired, send the user back to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth");
    if (error.response?.status === 401 && !isAuthCall) {
      clearSession();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// ---- auth ----
export const loginRequest = (credentials) =>
  api.post("/auth/login", credentials).then((r) => r.data);

export const signupRequest = (details) =>
  api.post("/auth/signup", details).then((r) => r.data);

// ---- students ----
export const fetchStudents = (search = "") =>
  api.get("/students", { params: search ? { search } : {} }).then((r) => r.data);

export const createStudent = (student) =>
  api.post("/students", student).then((r) => r.data);

export const updateStudent = (id, student) =>
  api.put(`/students/${id}`, student).then((r) => r.data);

export const deleteStudent = (id) => api.delete(`/students/${id}`);

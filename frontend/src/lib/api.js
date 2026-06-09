import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
    baseURL: `${API}/api`,
    withCredentials: true,
});

// Always attach Bearer token from localStorage as a fallback alongside cookies
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("publicos_token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const formatApiError = (err) => {
    const d = err?.response?.data?.detail;
    if (!d) return err?.message || "Something went wrong";
    if (typeof d === "string") return d;
    if (Array.isArray(d))
        return d.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(" ");
    if (d?.msg) return d.msg;
    return String(d);
};

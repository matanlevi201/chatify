import axios from "axios";

const BACKEND_URL = import.meta.env.BACKEND_URL;

export const api = axios.create({
  baseURL: BACKEND_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

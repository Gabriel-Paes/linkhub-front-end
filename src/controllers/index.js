import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const versionApi = "/api";

const _axios = axios.create({
  baseURL: `${baseURL}${versionApi}`,
  headers: { "Content-Type": "application/json" },
});

const setTokens = (tokens) =>
  localStorage.setItem("tokens", JSON.stringify(tokens));

const register = async ({ name, username, email, password }) => {
  try {
    const res = await _axios.post("/register/", {
      name,
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

const token = async ({ email, password }) => {
  try {
    const res = await _axios.post("/token/", { email, password });
    setTokens(res.data);
    return { ok: true };
  } catch (error) {
    throw error.response?.data;
  }
};

export { register, token };

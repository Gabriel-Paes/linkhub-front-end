import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const versionApi = "/api";

const _axios = axios.create({
  baseURL: `${baseURL}${versionApi}`,
  headers: { "Content-Type": "application/json" },
});

const setTokens = (tokens) =>
  localStorage.setItem("tokens", JSON.stringify(tokens));

const getTokens = () => JSON.parse(localStorage.getItem("tokens"));

const requiresAuth = (url) => {
  const authRoutes = /^\/(room|user|post|link)\//;
  return authRoutes.test(url);
};

_axios.interceptors.request.use(
  (config) => {
    if (requiresAuth(config.url)) {
      const token = getTokens().access;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

_axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = getTokens().refresh;
        if (!refreshToken) {
          throw new Error("Refresh token not available");
        }

        const { access } = await tokenRefresh({ refresh: refreshToken });
        setTokens({ access: access, refresh: refreshToken });
        error.config.headers.Authorization = `Bearer ${access}`;
        return _axios(error.config);
      } catch (refreshError) {
        window.location.href = "/logoff";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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

const tokenRefresh = async ({ refresh }) => {
  try {
    const res = await _axios.post("/token/refresh/", { refresh });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

const getRoom = async () => {
  try {
    const res = await _axios.get("/room/");
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

const postRoom = async ({ name }) => {
  try {
    const { data } = await _axios.post("/room/", { name });
    return data;
  } catch (error) {
    throw error.response?.data;
  }
};

const getPost = async (roomId) => {
  try {
    const res = await _axios.get(`/post/${roomId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

const postPost = async ({ title, body, room_id, links }) => {
  try {
    const { data } = await _axios.post("/post/", {
      title,
      body,
      room_id,
      links,
    });
    return data;
  } catch (error) {
    throw error.response?.data;
  }
};

const getLink = async () => {
  try {
    const { data } = await _axios.get("/link/");
    return data;
  } catch (error) {
    throw error.response?.data;
  }
};

const postLink = async ({ url }) => {
  try {
    const { data } = await _axios.post("/link/", { url });
    return data;
  } catch (error) {
    throw error.response?.data;
  }
};

export {
  register,
  token,
  getRoom,
  postRoom,
  getPost,
  postPost,
  getLink,
  postLink,
};

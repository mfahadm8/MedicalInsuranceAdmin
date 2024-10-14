import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

const refreshApiSession = async (): Promise<void> => {
  const { tokens } = await fetchAuthSession({
    forceRefresh: true,
  });
  const idToken = tokens?.idToken;
  if (idToken) {
    const auth = JSON.stringify({
      isSignedIn: true,
      token: idToken?.toString(),
      email: idToken?.payload.email,
    });
    localStorage.setItem("auth", auth);
  }
};
// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "https://api.dev.verifies.ai/admin",
});

// Add an interceptor to set the authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const storedAuth = localStorage.getItem("auth");
    const auth = storedAuth ? JSON.parse(storedAuth) : null;

    // Add Authorization header if auth token exists
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    // Add the x-api-key header
    config.headers["x-api-key"] = "czne2eTLd24w5WGqrwfkf3gr3HBZpvKp3HkEps68";

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add an interceptor to handle responses, including unauthorized errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Check if the error is due to an unauthorized status (401 or 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear the local storage and log out the user
      localStorage.removeItem("auth");
      localStorage.clear();
      signOut();
    } else {
      await refreshApiSession();
    }

    console.log(error);
    return Promise.reject(error);
  }
);

export default api;

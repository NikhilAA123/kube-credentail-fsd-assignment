import axios from "axios";

// --- Unified API Configuration ---
// The base URL comes from the .env file (VITE_API_BASE_URL)
// We default to the API Gateway port (3000)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// --- Axios Client ---
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Types and Functions ---

// ---------- Auth ----------
export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/signup", { name, email, password });
  return response.data;
};

// ---------- Issuance ----------
interface IssuePayload {
  userId: string;
  credentialType: string;
  claims: Record<string, unknown>;
}

interface IssueResponse {
  signedCredential: string;
  workerId: string;
  message: string;
}

export const issueCredential = async (
  payload: IssuePayload
): Promise<IssueResponse> => {
  // The API Gateway routes /issuance to the issuance service
  // We don't need /issuance prefix here if the gateway rewrites it, 
  // BUT based on gateway config: 
  // app.use('/issuance', ... pathRewrite: { '^/issuance': '' } ... target: ISSUANCE_URL)
  // So we MUST call /issuance/issue (assuming issuance service has /issue)
  // Wait, let's check issuance service routes. 
  // Assuming issuance service has /issue route.
  // The gateway maps /issuance -> / on issuance service? Or /issuance -> /issuance?
  // Gateway: pathRewrite: { '^/issuance': '' } means /issuance/foo -> /foo on target.
  // So if issuance service has /issue, we call /issuance/issue.
  const response = await apiClient.post("/issuance/issue", payload);
  return response.data;
};

// ---------- Verification ----------
interface VerifyPayload {
  signedCredential: string;
}

interface VerifyResponse {
  isValid: boolean;
  message: string;
  details?: {
    issuedBy: string;
    issuedAt: string;
  };
}

export const verifyCredential = async (
  payload: VerifyPayload
): Promise<VerifyResponse> => {
  // Gateway: pathRewrite: { '^/verification': '' }
  // If verification service has /verify, we call /verification/verify
  const response = await apiClient.post("/verification/verify", payload);
  return response.data;
};

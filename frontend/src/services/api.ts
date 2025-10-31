import axios from "axios";

// --- Unified API Configuration ---
// The base URL comes from the .env file (VITE_API_BASE_URL)
// Example in .env: VITE_API_BASE_URL=https://app.44.220.16.109.nip.io
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// --- Axios Client ---
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Types and Functions ---

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
  const response = await apiClient.post("/issue", payload);
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
  const response = await apiClient.post("/verify", payload);
  return response.data;
};

import axios from "axios";

// --- Final API Configuration ---
// All traffic now goes to the single Ingress URL.
// The Ingress will route /issue and /verify to the correct backend service.

const API_BASE_URL = "http://app.54.211.186.45.sslip.io"; // <-- UPDATE THIS with your sslip.io URL

// --- Axios API Clients ---
// Both clients now point to the same base URL
const issueApiClient = axios.create({
  baseURL: API_BASE_URL,
});

const verifyApiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Types and Functions (No changes needed below) ---

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
  const response = await issueApiClient.post("/issue", payload);
  return response.data;
};

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
  const response = await verifyApiClient.post("/verify", payload);
  return response.data;
};

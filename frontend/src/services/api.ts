import axios from "axios";

// --- API Service Configuration ---
// This setup allows for easy switching between different environments.
// For Vercel/Render deployment, the VITE_... variables will be used.
// For local development, it falls back to localhost.

/*
// --- AWS EKS Deployment URLs (For Reference) ---
const ISSUANCE_API_BASE_URL_AWS = 'http://a2b11ce0b51854599ba6cd2fa5cc0153-695954345.us-east-1.elb.amazonaws.com';
const VERIFICATION_API_BASE_URL_AWS = 'http://a573bbf9296ca4ac9946bc0ac0f9a955-1052267405.us-east-1.elb.amazonaws.com';
*/

// --- Vercel, Render, & Local Development Configuration ---
const ISSUANCE_API_BASE_URL =
  import.meta.env.VITE_ISSUANCE_API_URL || "http://localhost:8081";
const VERIFICATION_API_BASE_URL =
  import.meta.env.VITE_VERIFICATION_API_URL || "http://localhost:8082";

// --- Axios API Clients ---
const issueApiClient = axios.create({
  baseURL: ISSUANCE_API_BASE_URL,
});

const verifyApiClient = axios.create({
  baseURL: VERIFICATION_API_BASE_URL,
});

// --- Types and Functions ---

// Types for the Issuance Service
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

// Types for the Verification Service
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

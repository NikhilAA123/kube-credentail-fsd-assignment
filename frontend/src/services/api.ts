import axios from "axios";

// Define the structure of the request payload
interface IssuePayload {
  userId: string;
  credentialType: string;
  claims: Record<string, unknown>;
}

// Define the structure of the successful response
interface IssueResponse {
  signedCredential: string;
  workerId: string;
}

const apiClient = axios.create({
  baseURL: "http://localhost:8081", // The base URL for our backend
});

export const issueCredential = async (
  payload: IssuePayload
): Promise<IssueResponse> => {
  const response = await apiClient.post("/issue", payload);
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

const verifyApiClient = axios.create({
  baseURL: "http://localhost:8082", // Verification service will run on this port
});

export const verifyCredential = async (
  payload: VerifyPayload
): Promise<VerifyResponse> => {
  const response = await verifyApiClient.post("/verify", payload);
  return response.data;
};

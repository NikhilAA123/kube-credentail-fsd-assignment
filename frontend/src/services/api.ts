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

const issueApiClient = axios.create({
  baseURL:
    "http://a2b11ce0b51854599ba6cd2fa5cc0153-695954345.us-east-1.elb.amazonaws.com",
});

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

const verifyApiClient = axios.create({
  baseURL:
    "http://a573bbf9296ca4ac9946bc0ac0f9a955-1052267405.us-east-1.elb.amazonaws.com",
});

export const verifyCredential = async (
  payload: VerifyPayload
): Promise<VerifyResponse> => {
  const response = await verifyApiClient.post("/verify", payload);
  return response.data;
};

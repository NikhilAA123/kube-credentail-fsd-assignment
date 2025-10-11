import { Request, Response, NextFunction } from "express";
import { issueCredential } from "../src/controllers/issuance.controller";
import * as databaseService from "../src/services/database.service";

// Mock the entire database.service module.
jest.mock("../src/services/database.service");

// Describe is a way to group related tests together.
describe("Issuance Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = jest.fn();

  // beforeEach runs before each individual test, resetting our mock objects.
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Clear any previous mock history
    jest.clearAllMocks();
  });

  // --- Test Case 1: Successful Issuance ---
  test("should issue a new credential and return 201 when data is valid", async () => {
    mockRequest.body = {
      userId: "98084",
      credentialType: "dateofbirth",
      claims: { Name: "Nikhil", Age: 19 },
    };

    (databaseService.readDatabase as jest.Mock).mockResolvedValue([]);
    (databaseService.writeDatabase as jest.Mock).mockResolvedValue(undefined);

    await issueCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: expect.any(String),
      signedCredential: expect.any(String),
      workerId: expect.any(String),
    });
  });

  // --- Test Case 2: Duplicate Credential ---
  test("should return 409 if the credential already exists", async () => {
    const existingCredentialPayload = {
      userId: "98084",
      credentialType: "dateofbirth",
      claims: { Name: "Nikhil", Age: 19 },
    };
    mockRequest.body = existingCredentialPayload;

    (databaseService.readDatabase as jest.Mock).mockResolvedValue([
      {
        credential: {
          ...existingCredentialPayload,
          id: "some-uuid",
          issuer: "did:example:123456789abcdefghi",
          issuanceDate: new Date().toISOString(),
          type: ["VerifiableCredential", "dateofbirth"],
          credentialSubject: existingCredentialPayload.claims,
        },
      },
    ]);

    await issueCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "This credential has already been issued.",
    });
  });

  // --- Test Case 3: Invalid Input / Bad Request ---
  test("should return 400 if the request body is missing required fields", async () => {
    mockRequest.body = {
      userId: "98084",
      credentialType: "dateofbirth",
    };

    await issueCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "userId, credentialType, and claims are required.",
    });
  });
});

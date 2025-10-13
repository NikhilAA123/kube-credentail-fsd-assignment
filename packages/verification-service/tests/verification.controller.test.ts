import { Request, Response, NextFunction } from "express";
// 1. Import the correct controller function name
import { verifyCredentialController } from "../src/controllers/verification.controller";
import * as databaseService from "../src/services/database.service";

// Mock the database service to isolate our controller
jest.mock("../src/services/database.service");

describe("Verification Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = jest.fn();

  // Reset mocks before each test
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // --- Test Case 1: Successful Verification ---
  test("should return 200 and isValid:true if the credential exists", async () => {
    // Arrange: Create a credential object with a unique ID
    const credentialToVerify = {
      id: "http://example.edu/credentials/some-unique-id",
      name: "test-user",
      course: "testing",
    };

    // Arrange: Simulate what the frontend does - stringify and encode
    const signedCredential = Buffer.from(
      JSON.stringify(credentialToVerify)
    ).toString("base64");
    mockRequest.body = { signedCredential }; // 2. Send the correct request body

    // Arrange: Mock the database to return a record containing this credential
    (databaseService.readDatabase as jest.Mock).mockResolvedValue([
      {
        credential: credentialToVerify, // The DB stores the decoded object
        issuedBy: "Pantham",
        issuedAt: new Date().toISOString(),
      },
    ]);

    // Act: Call the controller
    await verifyCredentialController(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert: Check for a 200 OK response with the correct shape
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      // 3. Check for the correct response shape
      isValid: true,
      message: "Credential is valid and has been issued.",
      details: {
        issuedBy: "Pantham",
        issuedAt: expect.any(String),
      },
    });
  });

  // --- Test Case 2: Credential Not Found ---
  test("should return 404 and isValid:false if the credential does not exist", async () => {
    // Arrange: Create a credential that won't be in the mock DB
    const credentialToVerify = { id: "not-found-id" };
    const signedCredential = Buffer.from(
      JSON.stringify(credentialToVerify)
    ).toString("base64");
    mockRequest.body = { signedCredential };

    // Arrange: Mock the database to return an empty array
    (databaseService.readDatabase as jest.Mock).mockResolvedValue([]);

    // Act
    await verifyCredentialController(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert: Check for a 404 Not Found with the correct response shape
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      isValid: false,
      message: "Credential not found. It has not been issued or is invalid.",
    });
  });

  // --- Test Case 3: Missing Credential Data in Request ---
  test("should return 400 if signedCredential is missing", async () => {
    // Arrange: Request body is empty by default from our beforeEach setup
    mockRequest.body = {};

    // Act
    await verifyCredentialController(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert: Check for a 400 Bad Request with the correct error message
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "signedCredential is required.",
    });
  });
});

import { Request, Response, NextFunction } from "express";
import { verifyCredential } from "../src/controllers/verification.controller";
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
  });

  // Test Case 1: Successful Verification
  test("should return 200 if the credential exists", async () => {
    const existingCredential = { name: "test-user", course: "testing" };
    mockRequest.body = { credential: existingCredential };

    // Tell our mock to return a "database" containing the credential
    (databaseService.readDatabase as jest.Mock).mockResolvedValue([
      {
        credential: existingCredential,
        issuedBy: "Pantham",
        issuedAt: new Date().toISOString(),
      },
    ]);

    await verifyCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions: Check for a 200 OK response
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Credential verified successfully.",
      data: expect.any(Object),
    });
  });

  // Test Case 2: Credential Not Found
  test("should return 404 if the credential does not exist", async () => {
    mockRequest.body = {
      credential: { name: "non-existent-user", course: "testing" },
    };

    // Tell our mock to return an empty database
    (databaseService.readDatabase as jest.Mock).mockResolvedValue([]);

    await verifyCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions: Check for a 404 Not Found response
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Credential not found or has not been issued.",
    });
  });

  // Test Case 3: Missing Credential Data in Request
  test("should return 400 if credential data is missing", async () => {
    // Request body is empty by default from our beforeEach setup
    await verifyCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions: Check for a 400 Bad Request response
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Credential data is required.",
    });
  });
});

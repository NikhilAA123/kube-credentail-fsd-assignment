import { Request, Response, NextFunction } from "express";
import { issueCredential } from "../src/controllers/issuance.controller";
import * as databaseService from "../src/services/database.service";

// Mock the entire database.service module.
// This means we can control what its functions (readDatabase, writeDatabase) return.
jest.mock("../src/services/database.service");

// Describe is a way to group related tests together.
describe("Issuance Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = jest.fn();

  // beforeEach runs before each test, resetting our mock objects.
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test Case 1: Successful Issuance
  test("should issue a new credential and return 201", async () => {
    mockRequest.body = {
      credential: { name: "test-user", course: "testing" },
    };

    // Tell our mock to return an empty array (no duplicates).
    (databaseService.readDatabase as jest.Mock).mockResolvedValue([]);
    // Mock the write function so it does nothing.
    (databaseService.writeDatabase as jest.Mock).mockResolvedValue(undefined);

    await issueCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions: Check if the response is correct.
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: expect.stringContaining("credential issued by"),
    });
  });

  // Test Case 2: Duplicate Credential
  test("should return 409 if the credential already exists", async () => {
    const existingCredential = { name: "test-user", course: "testing" };
    mockRequest.body = { credential: existingCredential };

    // Tell our mock to return a database with the credential already in it.
    (databaseService.readDatabase as jest.Mock).mockResolvedValue([
      { credential: existingCredential },
    ]);

    await issueCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions: Check for the 409 Conflict response.
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "This credential has already been issued.",
    });
  });

  // Test Case 3: Missing Credential Data
  test("should return 400 if credential data is missing", async () => {
    // The body is empty by default from our beforeEach setup.
    await issueCredential(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions: Check for the 400 Bad Request response.
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Credential data is required.",
    });
  });
});

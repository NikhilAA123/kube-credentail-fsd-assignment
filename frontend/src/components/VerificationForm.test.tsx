import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import VerificationForm from "./VerificationForm";
import * as api from "../services/api";

// Mock the entire API module
jest.mock("../services/api");

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("VerificationForm Component", () => {
  const mockedVerifyCredential = api.verifyCredential as jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("renders the form field and submit button", () => {
    renderWithProviders(<VerificationForm />);
    expect(
      screen.getByLabelText(/Signed Credential \(JWT\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /verify credential/i })
    ).toBeInTheDocument();
  });

  test("successfully submits a valid credential and shows success message", async () => {
    mockedVerifyCredential.mockResolvedValue({
      isValid: true,
      message: "Credential is valid.",
      details: {
        issuedBy: "test-issuer",
        issuedAt: new Date().toISOString(),
      },
    });

    renderWithProviders(<VerificationForm />);
    const testJwt = "a.valid.jwt";
    fireEvent.change(screen.getByLabelText(/Signed Credential \(JWT\)/i), {
      target: { value: testJwt },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify credential/i }));

    await waitFor(() => {
      expect(mockedVerifyCredential).toHaveBeenCalledWith({
        signedCredential: testJwt,
      });
    });

    expect(
      await screen.findByText(/Verification Successful!/i)
    ).toBeInTheDocument();
  });

  test("shows an error message for an invalid credential", async () => {
    mockedVerifyCredential.mockRejectedValue(new Error("Invalid signature."));

    renderWithProviders(<VerificationForm />);
    const testJwt = "an.invalid.jwt";
    fireEvent.change(screen.getByLabelText(/Signed Credential \(JWT\)/i), {
      target: { value: testJwt },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify credential/i }));

    await waitFor(() => {
      expect(mockedVerifyCredential).toHaveBeenCalledWith({
        signedCredential: testJwt,
      });
    });

    // --- This is the corrected line ---
    // The component's code uses "API Error" as the title.
    expect(await screen.findByText(/API Error/i)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid signature./i)).toBeInTheDocument();
  });
});

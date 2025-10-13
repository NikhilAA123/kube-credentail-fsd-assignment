import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import IssuanceForm from "./IssueCredentialForm";
import * as api from "../services/api";

jest.mock("../services/api");

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("IssuanceForm Component", () => {
  const mockedIssueCredential = api.issueCredential as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all form fields and the submit button", () => {
    renderWithProviders(<IssuanceForm />);

    expect(screen.getByLabelText(/User ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Credential Type/i)).toBeInTheDocument();
    // --- This is the corrected line ---
    expect(
      screen.getByLabelText(/Claims \(JSON format\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /issue credential/i })
    ).toBeInTheDocument();
  });

  test("successfully submits the form and clears the fields", async () => {
    mockedIssueCredential.mockResolvedValue({
      message: "Success!",
      signedCredential: "some-jwt-string",
    });

    renderWithProviders(<IssuanceForm />);

    fireEvent.change(screen.getByLabelText(/User ID/i), {
      target: { value: "user123" },
    });
    fireEvent.change(screen.getByLabelText(/Credential Type/i), {
      target: { value: "proofOfAge" },
    });
    // --- This is the other corrected line ---
    fireEvent.change(screen.getByLabelText(/Claims \(JSON format\)/i), {
      target: { value: '{ "age": 30 }' },
    });

    fireEvent.click(screen.getByRole("button", { name: /issue credential/i }));

    await waitFor(() => {
      expect(mockedIssueCredential).toHaveBeenCalledWith({
        userId: "user123",
        credentialType: "proofOfAge",
        claims: { age: 30 },
      });
    });

    expect(screen.getByLabelText(/User ID/i)).toHaveValue("");
    expect(screen.getByLabelText(/Credential Type/i)).toHaveValue("");
    // --- And this is the final corrected line ---
    expect(screen.getByLabelText(/Claims \(JSON format\)/i)).toHaveValue("");

    expect(
      await screen.findByText(/Credential issued successfully!/i)
    ).toBeInTheDocument();
  });
});

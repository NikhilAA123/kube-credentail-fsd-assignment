import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { verifyCredential } from "../services/api2";
import axios from "axios";

// Define a type for our result state
type VerificationResult = {
  status: "success" | "error";
  title: string;
  message: string;
};

const VerificationForm = () => {
  const [signedCredential, setSignedCredential] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null); // Clear previous results

    try {
      const response = await verifyCredential({ signedCredential });

      if (response.isValid) {
        setResult({
          status: "success",
          title: "Verification Successful!",
          message: `This credential was issued by ${response.details?.issuedBy} at ${response.details?.issuedAt}.`,
        });
      } else {
        setResult({
          status: "error",
          title: "Verification Failed",
          message: response.message,
        });
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        // Handle standard JavaScript errors (like from our test mock)
        errorMessage = error.message;
      }
      toast({
        title: "API Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6}>Verify a Credential</Heading>
      <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Signed Credential (JWT)</FormLabel>
          <Textarea
            placeholder="Paste the signed credential here..."
            rows={8}
            value={signedCredential}
            onChange={(e) => setSignedCredential(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={!signedCredential}
        >
          Verify Credential
        </Button>
      </VStack>

      {/* --- Display Verification Result --- */}
      {result && (
        <Alert
          status={result.status}
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          mt={6}
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {result.title}
          </AlertTitle>
          <AlertDescription maxWidth="sm">{result.message}</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default VerificationForm;

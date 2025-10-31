import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { issueCredential } from "../services/api";

const IssuanceForm = () => {
  const [userId, setUserId] = useState("");
  const [credentialType, setCredentialType] = useState("");
  const [claims, setClaims] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signedCredential, setSignedCredential] = useState("");
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignedCredential("");

    try {
      const claimsJson = JSON.parse(claims);
      const data = await issueCredential({
        userId,
        credentialType,
        claims: claimsJson,
      });

      setSignedCredential(data.signedCredential);
      toast({
        title: "Credential issued successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setUserId("");
      setCredentialType("");
      setClaims("");
    } catch (error) {
      // --- Start of Added Lines ---
      let errorMessage = "An unknown error occurred.";

      if (axios.isAxiosError(error) && error.response) {
        // This checks for an API error and extracts the backend's message
        errorMessage = error.response.data.error || error.message;
      } else if (error instanceof Error) {
        // This handles other types of errors (e.g., bad JSON)
        errorMessage = error.message;
      }
      // --- End of Added Lines ---

      // The 'description' now uses the specific error message
      toast({
        title: "Error issuing credential.",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="userId">User ID</FormLabel>
            <Input
              id="userId"
              placeholder="e.g., user-12345"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="credentialType">Credential Type</FormLabel>
            <Input
              id="credentialType"
              placeholder="e.g., ProofOfAge"
              value={credentialType}
              onChange={(e) => setCredentialType(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="claims">Claims (JSON format)</FormLabel>
            <Textarea
              id="claims"
              placeholder='{ "name": "John Doe", "age": 30 }'
              value={claims}
              onChange={(e) => setClaims(e.target.value)}
              rows={5}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            width="full"
          >
            Issue Credential
          </Button>
        </VStack>
      </form>
      {signedCredential && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text fontWeight="bold" mb={2}>
            Signed Credential (JWT):
          </Text>
          <Text
            fontFamily="monospace"
            wordBreak="break-all"
            whiteSpace="pre-wrap"
          >
            {signedCredential}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default IssuanceForm;

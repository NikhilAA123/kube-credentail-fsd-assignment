import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Code,
} from "@chakra-ui/react";
// 1. Remove the unused 'AxiosError' from the import
import axios from "axios";

const IssueCredentialForm = () => {
  const [userId, setUserId] = useState("");
  const [credentialType, setCredentialType] = useState("");
  const [claims, setClaims] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signedCredential, setSignedCredential] = useState("");
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSignedCredential("");

    let parsedClaims;
    try {
      parsedClaims = JSON.parse(claims);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The claims field does not contain valid JSON.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("JSON Parse Error:", error);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/issue", {
        userId,
        credentialType,
        claims: parsedClaims,
      });

      setSignedCredential(response.data.signedCredential);
      toast({
        title: "Success!",
        description: `Credential issued by ${response.data.workerId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = "Something went wrong.";
      // 2. This type guard works without the direct import
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
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
      <Heading mb={6}>Issue a New Credential</Heading>
      <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
        {/* ... Form inputs remain the same ... */}
        <FormControl isRequired>
          <FormLabel>User ID</FormLabel>
          <Input
            placeholder="e.g., user-12345"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Credential Type</FormLabel>
          <Input
            placeholder="e.g., ProofOfAge"
            value={credentialType}
            onChange={(e) => setCredentialType(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Claims (JSON format)</FormLabel>
          <Textarea
            placeholder='{ "name": "John Doe", "age": 30 }'
            rows={5}
            value={claims}
            onChange={(e) => setClaims(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          Issue Credential
        </Button>
      </VStack>

      {signedCredential && (
        <Box mt={6}>
          <Heading size="md" mb={2}>
            Signed Credential (JWT)
          </Heading>
          <Code p={4} display="block" whiteSpace="pre-wrap">
            {signedCredential}
          </Code>
        </Box>
      )}
    </Box>
  );
};

export default IssueCredentialForm;

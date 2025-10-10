import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
} from "@chakra-ui/react";

const IssueCredentialForm = () => {
  return (
    <Box>
      <Heading mb={6}>Issue a New Credential</Heading>
      <VStack as="form" spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>User ID</FormLabel>
          <Input placeholder="e.g., user-12345" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Credential Type</FormLabel>
          <Input placeholder="e.g., ProofOfAge" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Claims (JSON format)</FormLabel>
          <Textarea placeholder='{ "name": "John Doe", "age": 30 }' rows={5} />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Issue Credential
        </Button>
      </VStack>
    </Box>
  );
};

export default IssueCredentialForm;

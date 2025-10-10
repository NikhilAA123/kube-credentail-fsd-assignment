import { Box, Flex, VStack, Heading, Link, Text } from "@chakra-ui/react";

function App() {
  return (
    <Flex h="100vh" w="100vw">
      {/* Sidebar */}
      <Box w="250px" bg="gray.800" color="white" p={5}>
        <VStack align="stretch" spacing={8}>
          <Heading size="md" as="h1">
            Creds-Manager
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Link>Issue Credential</Link>
            <Link>Verify Credential</Link>
          </VStack>{" "}
          {/* <-- Corrected this line */}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={10}>
        <Heading>Welcome to Creds-Manager</Heading>
        <Text mt={4}>Select an option from the sidebar to begin.</Text>
      </Box>
    </Flex>
  );
}

export default App;

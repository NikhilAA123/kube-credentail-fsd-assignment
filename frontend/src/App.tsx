import { useState } from "react";
import { Box, Flex, VStack, Heading, Link, Text } from "@chakra-ui/react";
// 1. Import your new page components
import IssuePage from "./components/IssuePage";
import VerificationPage from "./components/VerificationPage";

type Page = "issue" | "verify" | "home";

function App() {
  const [activePage, setActivePage] = useState<Page>("home");

  const renderContent = () => {
    switch (activePage) {
      // 2. Render the actual components
      case "issue":
        return <IssuePage />;
      case "verify":
        return <VerificationPage />;
      default:
        return (
          <>
            <Heading>Welcome to Creds-Manager</Heading>
            <Text mt={4}>Select an option from the sidebar to begin.</Text>
          </>
        );
    }
  };

  return (
    <Flex h="100vh" w="100vw">
      {/* Sidebar */}
      <Box w="250px" bg="gray.800" color="white" p={5}>
        <VStack align="stretch" spacing={8}>
          <Heading
            size="md"
            as="h1"
            cursor="pointer"
            onClick={() => setActivePage("home")}
          >
            Creds-Manager
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Link onClick={() => setActivePage("issue")}>Issue Credential</Link>
            <Link onClick={() => setActivePage("verify")}>
              Verify Credential
            </Link>
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={10}>
        {renderContent()}
      </Box>
    </Flex>
  );
}

export default App;

import { useState } from "react";
import { Box, Flex, VStack, Heading, Text } from "@chakra-ui/react";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import NavItem from "./components/NavItem";
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
      {/* --- Professional Sidebar --- */}
      <Box
        as="nav"
        w="250px"
        bg="gray.800"
        color="white"
        borderRight="1px"
        borderColor="gray.700"
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Heading
            size="md"
            as="h1"
            cursor="pointer"
            onClick={() => setActivePage("home")}
          >
            Creds-Manager
          </Heading>
        </Flex>

        <VStack as="nav" align="stretch" px={4}>
          <NavItem
            icon={AddIcon}
            isActive={activePage === "issue"}
            onClick={() => setActivePage("issue")}
          >
            Issue Credential
          </NavItem>
          <NavItem
            icon={CheckCircleIcon}
            isActive={activePage === "verify"}
            onClick={() => setActivePage("verify")}
          >
            Verify Credential
          </NavItem>
        </VStack>
      </Box>

      {/* --- Main Content --- */}
      <Box flex="1" p={10} bg="gray.50">
        {renderContent()}
      </Box>
    </Flex>
  );
}

export default App;

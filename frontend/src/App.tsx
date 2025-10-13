import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FilePlus, CheckCircle } from "lucide-react";
import NavItem from "./components/NavItem";
import IssuanceForm from "./components/IssueCredentialForm";
import VerificationForm from "./components/VerificationForm";

function App() {
  const [activePage, setActivePage] = useState("issue");

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  return (
    // Use responsive flexDirection: 'column' on base (mobile), 'row' on medium screens and up
    <Flex direction={{ base: "column", md: "row" }}>
      {/* Sidebar Navigation */}
      <Box
        // Use responsive width: 100% on mobile, 300px on medium screens and up
        w={{ base: "100%", md: "300px" }}
        h={{ base: "auto", md: "100vh" }} // Responsive height
        bg="gray.100"
        p="4"
        flexShrink={0} // Prevents the sidebar from shrinking
      >
        <Text fontSize="2xl" fontWeight="bold" mb="8">
          Kube Credential
        </Text>
        <NavItem
          icon={FilePlus}
          page="issue"
          activePage={activePage}
          onClick={handlePageChange}
        >
          Issue Credential
        </NavItem>
        <NavItem
          icon={CheckCircle}
          page="verify"
          activePage={activePage}
          onClick={handlePageChange}
        >
          Verify Credential
        </NavItem>
      </Box>

      {/* Main Content Area */}
      <Box flex="1" p={{ base: 4, md: 8 }}>
        {activePage === "issue" && <IssuanceForm />}
        {activePage === "verify" && <VerificationForm />}
      </Box>
    </Flex>
  );
}

export default App;

import { useState, useEffect } from "react";
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react";
import { FilePlus, CheckCircle, LogOut } from "lucide-react";
import NavItem from "./components/NavItem";
import IssuanceForm from "./components/IssueCredentialForm";
import VerificationForm from "./components/VerificationForm";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

interface User {
  id: string;
  name: string;
  email: string;
}

function App() {
  const [activePage, setActivePage] = useState("issue");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setAuthMode("login");
  };

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50" py={12} px={4}>
        <Box textAlign="center" mb={8}>
          <Text fontSize="4xl" fontWeight="bold" color="blue.600">
            Kube Credential
          </Text>
          <Text fontSize="lg" color="gray.600">
            Secure Credential Management System
          </Text>
        </Box>
        {authMode === "login" ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <SignupForm
            onSignupSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}
      </Box>
    );
  }

  return (
    // Use responsive flexDirection: 'column' on base (mobile), 'row' on medium screens and up
    <Flex direction={{ base: "column", md: "row" }} minH="100vh">
      {/* Sidebar Navigation */}
      <Box
        // Use responsive width: 100% on mobile, 300px on medium screens and up
        w={{ base: "100%", md: "300px" }}
        h={{ base: "auto", md: "100vh" }} // Responsive height
        bg="gray.900"
        color="white"
        p="6"
        flexShrink={0} // Prevents the sidebar from shrinking
        display="flex"
        flexDirection="column"
      >
        <Text fontSize="2xl" fontWeight="bold" mb="8" color="blue.400">
          Kube Credential
        </Text>

        <VStack spacing={2} align="stretch" flex="1">
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
        </VStack>

        <Box mt="auto" pt={6} borderTopWidth={1} borderColor="gray.700">
          <HStack mb={4}>
            <Box>
              <Text fontWeight="bold" fontSize="sm">{user?.name}</Text>
              <Text fontSize="xs" color="gray.400">{user?.email}</Text>
            </Box>
          </HStack>
          <Button
            leftIcon={<LogOut size={18} />}
            variant="outline"
            colorScheme="red"
            width="full"
            size="sm"
            onClick={handleLogout}
            _hover={{ bg: "red.900" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box flex="1" p={{ base: 4, md: 8 }} bg="gray.50">
        {activePage === "issue" && <IssuanceForm />}
        {activePage === "verify" && <VerificationForm />}
      </Box>
    </Flex>
  );
}

// Helper component for VStack to fix import error if not imported
import { VStack } from "@chakra-ui/react";

export default App;

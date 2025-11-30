import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    Heading,
} from "@chakra-ui/react";
import { login } from "../services/api";

interface LoginFormProps {
    onLoginSuccess: (user: any, token: string) => void;
    onSwitchToSignup: () => void;
}

const LoginForm = ({ onLoginSuccess, onSwitchToSignup }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await login(email, password);
            if (data.success) {
                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onLoginSuccess(data.user, data.token);
            }
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.response?.data?.error || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            w="100%"
            maxW="400px"
            mx="auto"
            mt={10}
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
        >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Heading size="lg">Login</Heading>
                <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
                <Text fontSize="sm">
                    Don't have an account?{" "}
                    <Button variant="link" colorScheme="blue" onClick={onSwitchToSignup}>
                        Sign Up
                    </Button>
                </Text>
            </VStack>
        </Box>
    );
};

export default LoginForm;

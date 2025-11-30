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
import { signup } from "../services/api";

interface SignupFormProps {
    onSignupSuccess: (user: any, token: string) => void;
    onSwitchToLogin: () => void;
}

const SignupForm = ({ onSignupSuccess, onSwitchToLogin }: SignupFormProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await signup(name, email, password);
            if (data.success) {
                toast({
                    title: "Account created.",
                    description: "We've created your account for you.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onSignupSuccess(data.user, data.token);
            }
        } catch (error: any) {
            toast({
                title: "Signup failed",
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
                <Heading size="lg">Sign Up</Heading>
                <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
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
                    Sign Up
                </Button>
                <Text fontSize="sm">
                    Already have an account?{" "}
                    <Button variant="link" colorScheme="blue" onClick={onSwitchToLogin}>
                        Log In
                    </Button>
                </Text>
            </VStack>
        </Box>
    );
};

export default SignupForm;

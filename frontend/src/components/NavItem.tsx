import { Icon, Link, Text, As } from "@chakra-ui/react";

interface NavItemProps {
  icon: As; // Type for the icon component
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavItem = ({ icon, isActive, onClick, children }: NavItemProps) => {
  return (
    <Link
      onClick={onClick}
      display="flex"
      alignItems="center"
      p={3}
      my={2}
      borderRadius="lg"
      role="group"
      cursor="pointer"
      userSelect="none"
      bg={isActive ? "blue.500" : "transparent"} // Highlight if active
      _hover={{
        bg: "gray.700",
      }}
      style={{ textDecoration: "none" }}
    >
      <Icon mr={4} fontSize="18" as={icon} />
      <Text fontSize="md">{children}</Text>
    </Link>
  );
};

export default NavItem;

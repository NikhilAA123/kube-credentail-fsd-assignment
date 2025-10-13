import { Flex, Icon, Link } from "@chakra-ui/react";
import React from "react";

interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  page: string;
  activePage: string;
  onClick: (page: string) => void;
}

const NavItem = ({
  icon,
  children,
  page,
  activePage,
  onClick,
}: NavItemProps) => {
  const isActive = page === activePage;

  return (
    <Link
      href="#" // <-- Add this line to make it a valid link
      onClick={() => onClick(page)}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      aria-current={isActive ? "page" : undefined}
    >
      <Flex
        // ... (rest of the Flex component is the same)
        data-testid="nav-item-container"
        align="center"
        p="4"
        mx="4"
        borderRadius="8px"
        role="group"
        cursor="pointer"
        bg={isActive ? "blue.500" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={
          !isActive
            ? {
                bg: "blue.400",
                color: "white",
              }
            : {}
        }
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export default NavItem;

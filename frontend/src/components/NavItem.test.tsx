import { render, screen } from "@testing-library/react";
import NavItem from "./NavItem";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "lucide-react";

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("NavItem Component", () => {
  test("renders the link text and icon", () => {
    renderWithChakra(
      <NavItem icon={Home} page="home" activePage="about" onClick={() => {}}>
        Dashboard
      </NavItem>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("applies active styles when the item is active", () => {
    renderWithChakra(
      <NavItem icon={Home} page="home" activePage="home" onClick={() => {}}>
        Dashboard
      </NavItem>
    );

    // Use getByTestId to select the container with the background color
    const linkElement = screen.getByRole("link", { name: /dashboard/i });
    expect(linkElement).toHaveAttribute("aria-current", "page");
  });
  test("does not apply active styles when the item is inactive", () => {
    renderWithChakra(
      <NavItem icon={Home} page="home" activePage="about" onClick={() => {}}>
        Dashboard
      </NavItem>
    );

    // Also use getByTestId here for consistency
    const linkElement = screen.getByRole("link", { name: /dashboard/i });
    expect(linkElement).not.toHaveAttribute("aria-current");
  });
});

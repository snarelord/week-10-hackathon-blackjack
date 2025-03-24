import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "@/components/Card";

// Mock the CSS module
jest.mock("@/components/Card.module.css", () => ({
  card: "card",
  faceUp: "faceUp",
  faceDown: "faceDown",
  red: "red",
  black: "black",
  cardContent: "cardContent",
  corner: "corner",
  center: "center",
  bottomRight: "bottomRight",
}));

describe("Card", () => {
  // Test basic rendering and props
  it("should render a card with correct value and suit", () => {
    render(<Card suit="hearts" value="A" />);
    const values = screen.getAllByText("A");
    expect(values).toHaveLength(2);
    expect(screen.getByTestId("center-suit")).toHaveTextContent("♥");
  });

  // Test face up state (default)
  it("should show content when face up (default)", () => {
    render(<Card suit="diamonds" value="K" />);

    // Should show the value in both corners
    const values = screen.getAllByText("K");
    expect(values).toHaveLength(2);

    // Should show the suit symbol in three places (two corners and center)
    const symbols = screen.getAllByText("♦");
    expect(symbols).toHaveLength(3);
  });

  // Test face down state
  it("should hide content when face down", () => {
    render(<Card suit="hearts" value="A" faceUp={false} />);
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.queryByText("♥")).not.toBeInTheDocument();
  });

  // Test red suits
  it("should apply red class for hearts", () => {
    render(<Card suit="hearts" value="A" />);
    expect(screen.getByTestId("card-content")).toHaveClass("red");
  });

  it("should apply red class for diamonds", () => {
    render(<Card suit="diamonds" value="A" />);
    expect(screen.getByTestId("card-content")).toHaveClass("red");
  });

  // Test black suits
  it("should apply black class for clubs", () => {
    render(<Card suit="clubs" value="A" />);
    expect(screen.getByTestId("card-content")).toHaveClass("black");
  });

  it("should apply black class for spades", () => {
    render(<Card suit="spades" value="A" />);
    expect(screen.getByTestId("card-content")).toHaveClass("black");
  });

  // Test card orientation classes
  it("should apply correct classes for face up/down states", () => {
    const { rerender } = render(<Card suit="hearts" value="A" />);
    expect(screen.getByTestId("card")).toHaveClass("faceUp");
    expect(screen.getByTestId("card")).not.toHaveClass("faceDown");

    // Test face down state
    rerender(<Card suit="hearts" value="A" faceUp={false} />);
    expect(screen.getByTestId("card")).toHaveClass("faceDown");
    expect(screen.getByTestId("card")).not.toHaveClass("faceUp");
  });
});

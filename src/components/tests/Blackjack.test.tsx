import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlackjackVsComputer from "../BlackjackVsComputer/BlackjackVsComputer";
import * as deckUtils from "@/utils/deck";
// import { calculateHandValue, playerHand } from "./Blackjack";

jest.mock("@/utils/deck");

describe("Blackjack Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(deckUtils, "createBlackjackDeck").mockReturnValue([]);
  });

  test("renders initial game state", () => {
    render(
      <BlackjackVsComputer
        onBackToMenu={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    expect(screen.getByText("BLACKJACK")).toBeInTheDocument();
    expect(screen.getByText("Dealer's Hand")).toBeInTheDocument();
    expect(screen.getByText("Player's Hand(0)")).toBeInTheDocument();
    expect(screen.getByText(/BALANCE:\s*£\s*1000/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter bet amount")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Place Bet" })).toBeInTheDocument();
  });

  test("handles invalid bet input", () => {
    render(
      <BlackjackVsComputer
        onBackToMenu={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    const placeBetButton = screen.getByRole("button", { name: "Place Bet" });

    // Test invalid bet amount
    fireEvent.change(betInput, { target: { value: "-50" } });
    fireEvent.click(placeBetButton);
    expect(screen.getByText("Invalid bet amount. Please enter a valid bet.")).toBeInTheDocument();

    // Test bet amount greater than balance
    fireEvent.change(betInput, { target: { value: "2000" } });
    fireEvent.click(placeBetButton);
    expect(screen.getByText("Invalid bet amount. Please enter a valid bet.")).toBeInTheDocument();
  });

  test("places valid bet and starts game", () => {
    jest
      .spyOn(deckUtils, "drawCard")
      .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])
      .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []])
      .mockReturnValueOnce([{ suit: "clubs", value: "4" }, []]);

    render(
      <BlackjackVsComputer
        onBackToMenu={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    const placeBetButton = screen.getByRole("button", { name: "Place Bet" });

    fireEvent.change(betInput, { target: { value: "100" } });
    fireEvent.click(placeBetButton);

    expect(screen.getByText("Your turn: Hit or Stand?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stand" })).toBeInTheDocument();
    expect(screen.getByText("CURRENT BET: £100")).toBeInTheDocument();
    expect(screen.getByText("BALANCE: £900")).toBeInTheDocument();
  });

  test("handles player actions - hit", () => {
    jest
      .spyOn(deckUtils, "drawCard")
      .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])
      .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []])
      .mockReturnValueOnce([{ suit: "clubs", value: "4" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "3" }, []]);

    render(
      <BlackjackVsComputer
        onBackToMenu={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    fireEvent.change(betInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));

    const hitButton = screen.getByRole("button", { name: "Hit" });
    fireEvent.click(hitButton);

    expect(screen.getByText("Your turn: Hit or Stand?")).toBeInTheDocument();
  });

  test("handles player actions - stand", () => {
    jest
      .spyOn(deckUtils, "drawCard")
      .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])
      .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []])
      .mockReturnValueOnce([{ suit: "clubs", value: "4" }, []]);

    render(
      <BlackjackVsComputer
        onBackToMenu={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    fireEvent.change(betInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));

    const standButton = screen.getByRole("button", { name: "Stand" });
    fireEvent.click(standButton);

    expect(screen.getByText("Dealer's turn...")).toBeInTheDocument();
  });
});

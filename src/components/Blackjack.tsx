"use client";

import { useState, useEffect } from "react";
import Card, { type CardProps } from "./Card";
import { createBlackjackDeck, drawCard } from "@/utils/deck";
import Button from "./ui/Button";
import styles from "./styles/Blackjack.module.css";

interface BlackjackProps {
  onBackToMenu: () => void;
}

const Blackjack = ({ onBackToMenu }: BlackjackProps) => {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealerTurn" | "gameOver">("betting");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [betInput, setBetInput] = useState("");

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = (newBalance?: number) => {
    const newDeck = createBlackjackDeck();
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameState("betting");
    setMessage("");
    setCurrentBet(0);
    setBetInput("");
    if (newBalance !== undefined) {
      setBalance(newBalance);
    }
  };

  const placeBet = () => {
    const betAmount = Number.parseInt(betInput);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
      setMessage("Invalid bet amount. Please enter a valid bet.");
      return;
    }
    setCurrentBet(betAmount);
    setBalance(balance - betAmount);
    startGame();
  };

  const startGame = () => {
    let currentDeck = createBlackjackDeck();
    const playerCards: CardProps[] = [];
    const dealerCards: CardProps[] = [];

    for (let i = 0; i < 2; i++) {
      const [playerCard, remainingDeck] = drawCard(currentDeck);
      playerCards.push(playerCard);
      currentDeck = remainingDeck;

      const [dealerCard, newDeck] = drawCard(currentDeck);
      dealerCards.push(dealerCard);
      currentDeck = newDeck;
    }

    setDeck(currentDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState("playing");
    setMessage("Your turn: Hit or Stand?");
  };

  const hit = () => {
    const [newCard, newDeck] = drawCard(deck);
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(newDeck);

    if (calculateHandValue(newHand) > 21) {
      setGameState("gameOver");
      setMessage("Bust! You lose.");
      endRound(false);
    } else {
      setMessage("Your turn: Hit or Stand?");
    }
  };

  const stand = () => {
    setGameState("dealerTurn");
    setMessage("Dealer's turn...");
    setTimeout(dealerPlay, 1000);
  };

  const dealerPlay = () => {
    const currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    while (calculateHandValue(currentDealerHand) < 17) {
      const [newCard, newDeck] = drawCard(currentDeck);
      currentDealerHand.push(newCard);
      currentDeck = newDeck;
    }

    setDealerHand(currentDealerHand);
    setDeck(currentDeck);

    const dealerValue = calculateHandValue(currentDealerHand);
    const playerValue = calculateHandValue(playerHand);

    if (dealerValue > 21 || playerValue > dealerValue) {
      setMessage("You win!");
      endRound(true);
    } else if (dealerValue > playerValue) {
      setMessage("Dealer wins!");
      endRound(false);
    } else {
      setMessage("It's a tie!");
      endRound(true, true);
    }

    setGameState("gameOver");
  };

  const calculateHandValue = (hand: CardProps[]): number => {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.value === "A") {
        aces += 1;
      } else if (["K", "Q", "J"].includes(card.value)) {
        value += 10;
      } else {
        value += Number.parseInt(card.value);
      }
    }

    for (let i = 0; i < aces; i++) {
      if (value + 11 <= 21) {
        value += 11;
      } else {
        value += 1;
      }
    }

    return value;
  };

  const endRound = (playerWins: boolean, tie = false) => {
    if (tie) {
      setBalance(balance + currentBet);
    } else if (playerWins) {
      setBalance(balance + currentBet * 2);
    }

    if (balance <= 0) {
      setMessage("Game Over! You ran out of money. Want to play again?");
    }
  };

  return (
    <div className={styles.blackjack}>
      <div className={styles.gameArea}>
        <h2 className={styles.headingblackjack}>BLACKJACK</h2>
        <Button variant="outline" size="sm" onClick={onBackToMenu}>
          Back to Menu
        </Button>
        <div className={styles.message}>{message}</div>
        <div className={styles.hands}>
          <div className={styles.hand}>
            <h3>Dealer's Hand</h3>
            <div className={styles.cards}>
              {dealerHand.map((card, index) => (
                <Card key={index} {...card} faceUp={index === 0 || gameState === "gameOver"} />
              ))}
            </div>
            {gameState === "gameOver" && <p className="total">Total: {calculateHandValue(dealerHand)}</p>}
          </div>
          <div className={styles.hand}>
            <h3>Player's Hand({calculateHandValue(playerHand)})</h3>
            <div className={styles.cards}>
              {playerHand.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
        {gameState === "betting" && (
          <div className={styles.betting}>
            <input
              type="number"
              value={betInput}
              onChange={(e) => setBetInput(e.target.value)}
              placeholder="Enter bet amount"
              className={styles.betInput}
            />
            <button className={styles.actionButton} onClick={placeBet}>
              Place Bet
            </button>
          </div>
        )}
        {gameState === "playing" && (
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={hit}>
              Hit
            </button>
            <button className={styles.actionButton} onClick={stand}>
              Stand
            </button>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className={styles.actions}>
            {balance > 0 ? (
              <button className={styles.actionButton} onClick={() => resetGame()}>
                Play Again
              </button>
            ) : (
              <button className={styles.actionButton} onClick={() => resetGame(1000)}>
                Restart Game
              </button>
            )}
          </div>
        )}
      </div>
      <div className={styles.sidebar}>
        <div className={styles.stats}>
          <p>BALANCE: £{balance}</p>
          <p>CURRENT BET: £{currentBet}</p>
        </div>
      </div>
    </div>
  );
};

export default Blackjack;

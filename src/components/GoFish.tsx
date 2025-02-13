"use client"

import { useState, useEffect } from "react"
import Card, { type CardProps } from "./Card"
import { createGoFishDeck, drawCard, checkForDuplicates } from "@/utils/deck"
import styles from "./GoFish.module.css"

const GoFish = () => {
  const [deck, setDeck] = useState<CardProps[]>([])
  const [playerHand, setPlayerHand] = useState<CardProps[]>([])
  const [computerHand, setComputerHand] = useState<CardProps[]>([])
  const [playerBooks, setPlayerBooks] = useState<string[]>([])
  const [computerBooks, setComputerBooks] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [gameState, setGameState] = useState<"instructions" | "playing" | "gameOver">("instructions")
  const [currentInstruction, setCurrentInstruction] = useState(0)
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null)

  const instructions = [
    "Welcome to Go Fish! The goal is to collect the most 'books' of cards.",
    "A 'book' is a set of four cards with the same value (e.g., four Kings).",
    "On your turn, ask the computer for a card value you have in your hand.",
    "If the computer has the card, you get all of their cards of that value.",
    "If the computer doesn't have the card, you 'Go Fish' and draw from the deck.",
    "If you get the card you asked for from the deck, you get another turn.",
    "The game ends when all books are collected. The player with the most books wins!",
    "Click on a card in your hand to select it, then click 'Ask for Card' to make your move.",
    "Ready to play? Click 'Start Game' when you're done reading the instructions!",
  ]

  const startNewGame = () => {
    const newDeck = createGoFishDeck()
    if (checkForDuplicates(newDeck)) {
      console.error("Duplicate cards found in the Go Fish deck!")
      setMessage("Error: Duplicate cards found. Please try again.")
      return
    }
    setDeck(newDeck)
    setPlayerHand([])
    setComputerHand([])
    setPlayerBooks([])
    setComputerBooks([])
    setMessage("Starting a new game. Dealing cards...")
    dealInitialHands(newDeck)
  }

  const dealInitialHands = (deck: CardProps[]) => {
    let currentDeck = [...deck]
    const playerCards: CardProps[] = []
    const computerCards: CardProps[] = []

    for (let i = 0; i < 7; i++) {
      const [playerCard, remainingDeck] = drawCard(currentDeck)
      playerCards.push(playerCard)
      currentDeck = remainingDeck

      const [computerCard, newDeck] = drawCard(currentDeck)
      computerCards.push(computerCard)
      currentDeck = newDeck
    }

    setDeck(currentDeck)
    setPlayerHand(playerCards)
    setComputerHand(computerCards)
    setGameState("playing")
    setMessage("Cards dealt. Select a card from your hand and click 'Ask for Card'.")
  }

  const askForCard = () => {
    if (!selectedCard) {
      setMessage("Please select a card from your hand first.")
      return
    }

    const value = selectedCard.value
    setMessage(`You asked for ${value}s...`)

    setTimeout(() => {
      const matchingCards = computerHand.filter((card) => card.value === value)
      if (matchingCards.length > 0) {
        const newPlayerHand = [...playerHand, ...matchingCards]
        setPlayerHand(newPlayerHand)
        setComputerHand(computerHand.filter((card) => card.value !== value))
        setMessage(`You got ${matchingCards.length} ${value}${matchingCards.length > 1 ? "s" : ""}!`)
        checkAndUpdateBooks(newPlayerHand, true)
      } else {
        setMessage("Go Fish! Click the 'Go Fish' button to draw a card from the deck.")
      }
      setSelectedCard(null)
    }, 1500)
  }

  const goFish = (player: "player" | "computer") => {
    if (deck.length === 0) {
      setMessage("No more cards in the deck!")
      setGameState("gameOver")
      return
    }

    const [newCard, newDeck] = drawCard(deck)
    setDeck(newDeck)

    if (player === "player") {
      const newPlayerHand = [...playerHand, newCard]
      setPlayerHand(newPlayerHand)
      setMessage(`You drew a ${newCard.value} of ${newCard.suit}.`)
      checkAndUpdateBooks(newPlayerHand, true)
      if (newCard.value !== selectedCard?.value) {
        setTimeout(() => {
          setMessage("It's the computer's turn now.")
          setTimeout(computerTurn, 1500)
        }, 1500)
      } else {
        setMessage("You drew the card you asked for! You get another turn.")
      }
      setSelectedCard(null)
    } else {
      const newComputerHand = [...computerHand, newCard]
      setComputerHand(newComputerHand)
      setMessage("Computer went fishing and drew a card.")
      checkAndUpdateBooks(newComputerHand, false)
      setTimeout(() => {
        setMessage("It's your turn again. Select a card and click 'Ask for Card'.")
      }, 1500)
    }
  }

  const computerTurn = () => {
    if (computerHand.length === 0) {
      setMessage("Computer has no cards left. Game over!")
      setGameState("gameOver")
      return
    }

    const randomValue = computerHand[Math.floor(Math.random() * computerHand.length)].value
    setMessage(`Computer asks: Do you have any ${randomValue}s?`)

    setTimeout(() => {
      const matchingCards = playerHand.filter((card) => card.value === randomValue)

      if (matchingCards.length > 0) {
        const newComputerHand = [...computerHand, ...matchingCards]
        setComputerHand(newComputerHand)
        setPlayerHand(playerHand.filter((card) => card.value !== randomValue))
        setMessage(
          `You gave ${matchingCards.length} ${randomValue}${matchingCards.length > 1 ? "s" : ""} to the computer.`,
        )
        checkAndUpdateBooks(newComputerHand, false)
        setTimeout(computerTurn, 1500)
      } else {
        setMessage("You say: 'Go Fish!' Computer is drawing a card...")
        setTimeout(() => {
          goFish("computer")
        }, 1500)
      }
    }, 1500)
  }

  const checkGameOver = () => {
    if (playerHand.length === 0 && computerHand.length === 0 && deck.length === 0) {
      setGameState("gameOver")
      if (playerBooks.length > computerBooks.length) {
        setMessage(`Game Over! You win with ${playerBooks.length} books to ${computerBooks.length}!`)
      } else if (computerBooks.length > playerBooks.length) {
        setMessage(`Game Over! Computer wins with ${computerBooks.length} books to ${playerBooks.length}!`)
      } else {
        setMessage(`Game Over! It's a tie with ${playerBooks.length} books each!`)
      }
    }
  }

  const countBooks = (hand: CardProps[]): string[] => {
    const valueCounts: { [key: string]: number } = {}
    hand.forEach((card) => {
      valueCounts[card.value] = (valueCounts[card.value] || 0) + 1
    })
    return Object.entries(valueCounts)
      .filter(([_, count]) => count === 4)
      .map(([value, _]) => value)
  }

  const checkAndUpdateBooks = (hand: CardProps[], isPlayer: boolean) => {
    const books = countBooks(hand)
    if (books.length > 0) {
      if (isPlayer) {
        setPlayerBooks([...playerBooks, ...books])
        setPlayerHand(hand.filter((card) => !books.includes(card.value)))
      } else {
        setComputerBooks([...computerBooks, ...books])
        setComputerHand(hand.filter((card) => !books.includes(card.value)))
      }
      setMessage(
        `${isPlayer ? "You" : "Computer"} completed ${books.length} book${books.length > 1 ? "s" : ""}! (${books.join(", ")})`,
      )
    }
  }

  useEffect(() => {
    checkGameOver()
  }, [playerHand, computerHand, deck, playerBooks, computerBooks])

  return (
    <div className={styles.goFish}>
      <h2>Go Fish</h2>
      <div className={styles.message}>{message}</div>
      {gameState === "instructions" && (
        <div className={styles.instructions}>
          <p>{instructions[currentInstruction]}</p>
          <div className={styles.instructionButtons}>
            <button
              className={styles.actionButton}
              onClick={() => setCurrentInstruction(Math.max(0, currentInstruction - 1))}
              disabled={currentInstruction === 0}
            >
              Back
            </button>
            <button
              className={styles.actionButton}
              onClick={() => {
                if (currentInstruction === instructions.length - 1) {
                  startNewGame()
                } else {
                  setCurrentInstruction(currentInstruction + 1)
                }
              }}
            >
              {currentInstruction === instructions.length - 1 ? "Start Game" : "Next"}
            </button>
          </div>
        </div>
      )}
      {gameState !== "instructions" && (
        <div>
          <div className={styles.books}>
            <p>Your Books: {playerBooks.join(", ") || "None"}</p>
            <p>Computer's Books: {computerBooks.join(", ") || "None"}</p>
          </div>
          <div className={styles.hands}>
            <div className={styles.hand}>
              <h3>Your Hand ({playerHand.length} cards)</h3>
              <div className={styles.cards}>
                {playerHand.map((card, index) => (
                  <div
                    key={index}
                    className={`${styles.cardWrapper} ${selectedCard === card ? styles.selected : ""}`}
                    onClick={() => setSelectedCard(card)}
                  >
                    <Card {...card} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.hand}>
              <h3>Computer's Hand ({computerHand.length} cards)</h3>
              <div className={styles.cards}>
                {computerHand.map((card, index) => (
                  <Card key={index} {...card} faceUp={false} />
                ))}
              </div>
            </div>
          </div>
          {gameState === "playing" && (
            <div className={styles.actions}>
              <button className={styles.actionButton} onClick={askForCard} disabled={!selectedCard}>
                Ask for Card
              </button>
              <button className={styles.actionButton} onClick={() => goFish("player")}>
                Go Fish
              </button>
            </div>
          )}
          {gameState === "gameOver" && (
            <button
              className={styles.actionButton}
              onClick={() => {
                setGameState("instructions")
                setCurrentInstruction(0)
              }}
            >
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default GoFish


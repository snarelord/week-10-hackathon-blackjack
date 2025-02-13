import type { CardProps } from "@/components/Card";

const suits: CardProps["suit"][] = ["hearts", "diamonds", "clubs", "spades"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export const createGoFishDeck = (): CardProps[] => {
  const deck: CardProps[] = [];
  for (let i = 0; i < 1; i++) {
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
  }
  return shuffleDeck(deck);
};

export const createBlackjackDeck = (): CardProps[] => {
  const deck: CardProps[] = [];
  for (let i = 0; i < 6; i++) {
    // Using 6 decks for Blackjack
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
  }
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: CardProps[]): CardProps[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const drawCard = (deck: CardProps[]): [CardProps, CardProps[]] => {
  const [drawnCard, ...remainingDeck] = deck;
  return [drawnCard, remainingDeck];
};

export const checkForDuplicates = (deck: CardProps[]): boolean => {
  const seenCards = new Set<string>();
  for (const card of deck) {
    const cardKey = `${card.suit}-${card.value}`;
    if (seenCards.has(cardKey)) {
      return true;
    }
    seenCards.add(cardKey);
  }
  return false;
};

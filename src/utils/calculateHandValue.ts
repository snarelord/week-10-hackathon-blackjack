import type { CardProps } from "../components/Card";

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

export default calculateHandValue;

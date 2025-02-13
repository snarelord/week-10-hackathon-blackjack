import styles from "./Card.module.css"

export interface CardProps {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: string
  faceUp?: boolean
}

const Card = ({ suit, value, faceUp = true }: CardProps) => {
  const getColor = () => {
    return suit === "hearts" || suit === "diamonds" ? styles.red : styles.black
  }

  const getSuitSymbol = (suit: CardProps["suit"]) => {
    switch (suit) {
      case "hearts":
        return "♥"
      case "diamonds":
        return "♦"
      case "clubs":
        return "♣"
      case "spades":
        return "♠"
    }
  }

  return (
    <div className={`${styles.card} ${faceUp ? styles.faceUp : styles.faceDown}`}>
      {faceUp && (
        <div className={`${styles.cardContent} ${getColor()}`}>
          <div className={styles.corner}>
            <div>{value}</div>
            <div>{getSuitSymbol(suit)}</div>
          </div>
          <div className={styles.center}>{getSuitSymbol(suit)}</div>
          <div className={`${styles.corner} ${styles.bottomRight}`}>
            <div>{value}</div>
            <div>{getSuitSymbol(suit)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Card


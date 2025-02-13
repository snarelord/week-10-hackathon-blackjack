import styles from "./GameSelector.module.css"

interface GameSelectorProps {
  currentGame: "blackjack" | "gofish"
  setCurrentGame: (game: "blackjack" | "gofish") => void
}

const GameSelector = ({ currentGame, setCurrentGame }: GameSelectorProps) => {
  return (
    <div className={styles.gameSelector}>
      <button
        className={`${styles.gameButton} ${currentGame === "blackjack" ? styles.active : ""}`}
        onClick={() => setCurrentGame("blackjack")}
      >
        Blackjack
      </button>
      <button
        className={`${styles.gameButton} ${currentGame === "gofish" ? styles.active : ""}`}
        onClick={() => setCurrentGame("gofish")}
      >
        Go Fish
      </button>
    </div>
  )
}

export default GameSelector


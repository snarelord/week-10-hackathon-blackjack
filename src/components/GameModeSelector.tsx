"use client";

import { useState } from "react";
import styles from "./styles/GameModeSelector.module.css";
import Blackjack from "./Blackjack";
// import BlackjackOnline from "./BlackjackOnline";
import Card from "./ui/Card";
import Button from "./ui/Button";

type GameMode = "select" | "singlePlayer" | "online";

const GameModeSelector = () => {
  const [gameMode, setGameMode] = useState<GameMode>("select");

  const handleBackToMenu = () => {
    setGameMode("select");
  };

  if (gameMode === "singlePlayer") {
    return <Blackjack onBackToMenu={handleBackToMenu} />;
  }

  //   if (gameMode === "online") {
  //     return <BlackjackOnline onBackToMenu={handleBackToMenu} />;
  //   }

  return (
    <Card className={styles.modeSelector}>
      <h1 className={styles.title}>Blackjack</h1>
      <p className={styles.description}>
        Choose a game mode to play. Challenge the computer or play with friends online!
      </p>
      <div className={styles.options}>
        <Button size="lg" className={styles.option} onClick={() => setGameMode("singlePlayer")}>
          Play vs Computer
        </Button>
        <Button size="lg" className={styles.option} onClick={() => setGameMode("online")}>
          Play Online
        </Button>
      </div>
    </Card>
  );
};

export default GameModeSelector;

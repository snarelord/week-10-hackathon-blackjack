"use client";

import { useState, useEffect } from "react";
import styles from "./styles/GameContainer.module.css";
import GameModeSelector from "./GameModeSelector";

const GameContainer = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`${styles.gameContainer} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button className={styles.darkModeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <GameModeSelector />
      </div>
    </div>
  );
};

export default GameContainer;

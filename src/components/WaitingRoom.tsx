"use client";
import styles from "./styles/WaitingRoom.module.css";
import Button from "./ui/Button";

interface WaitingRoomProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  roomCode: string;
  setRoomCode: (code: string) => void;
  createRoom: () => void;
  joinRoom: () => void;
  startGame: () => void;
  players: Array<{ id: string; name: string }>;
  isHost: boolean;
  onBackToMenu: () => void;
}

export default function WaitingRoom({
  playerName,
  setPlayerName,
  roomCode,
  setRoomCode,
  createRoom,
  joinRoom,
  startGame,
  players,
  isHost,
  onBackToMenu,
}: WaitingRoomProps) {
  const isInRoom = players.length > 0;

  return (
    <div className={styles.waitingRoom}>
      <div className={styles.header}>
        <h2 className={styles.title}>Blackjack Online</h2>
        <Button className={styles.backButton} size="sm" onClick={onBackToMenu}>
          Back
        </Button>
      </div>

      {!isInRoom ? (
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="playerName" className={styles.label}>
              Your Name
            </label>
            <input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
            />
          </div>

          <div className={styles.buttonContainer}>
            <Button className={styles.newGameButton} onClick={createRoom} disabled={!playerName}>
              Create New Game
            </Button>

            <div className={styles.divider}>or</div>

            <div className={styles.formGroup}>
              <label htmlFor="roomCode" className={styles.label}>
                Room Code
              </label>
              <input
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className={styles.input}
              />
            </div>

            <Button className={styles.joinGameButton} onClick={joinRoom} disabled={!playerName || !roomCode}>
              Join Game
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.roomInfo}>
            <h3 className={styles.playersTitle}>Room Code</h3>
            <p className={styles.roomCode}>{roomCode}</p>
            <p className={styles.shareText}>Share this code with friends to join</p>
          </div>

          <div className={styles.playersList}>
            <h3 className={styles.playersTitle}>Players</h3>
            <ul>
              {players.map((player) => (
                <li key={player.id} className={styles.playerItem}>
                  <span>{player.name}</span>
                  {player.id === players[0]?.id && <span className={styles.hostBadge}>(Host)</span>}
                </li>
              ))}
            </ul>
          </div>

          {isHost && (
            <Button onClick={startGame} disabled={players.length < 1}>
              Start Game
            </Button>
          )}

          {!isHost && <p className={styles.waitingText}>Waiting for host to start the game...</p>}
        </div>
      )}
    </div>
  );
}

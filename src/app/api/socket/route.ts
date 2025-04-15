import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

// This is a workaround for handling WebSockets in Next.js
// In a production environment, you would use a dedicated WebSocket server

// Type definitions
type CardType = {
  suit: string;
  value: string;
  hidden?: boolean;
};

type Player = {
  id: string;
  name: string;
  hand: CardType[];
  score: number;
  status: "playing" | "standing" | "busted";
};

type GameState = {
  playerHand: CardType[];
  dealerHand: CardType[];
  players: Player[];
  currentPlayer: string;
  gameStatus: "waiting" | "playing" | "finished";
  winner: string | null;
};

type Room = {
  id: string;
  code: string;
  gameState: GameState;
  hostId: string;
};

// In-memory store for rooms
const rooms: Record<string, Room> = {};

// Socket.io server instance
let io: any;

// Initialize Socket.io server
function initSocketServer() {
  if (!io) {
    // @ts-ignore - Next.js API route handler
    const httpServer = global.httpServer;

    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket: any) => {
      console.log("Client connected:", socket.id);

      // Create a new room
      socket.on("createRoom", ({ playerName }: { playerName: string }) => {
        const roomId = generateRoomId();
        const roomCode = generateRoomCode();

        const newRoom: Room = {
          id: roomId,
          code: roomCode,
          hostId: socket.id,
          gameState: {
            playerHand: [],
            dealerHand: [],
            players: [
              {
                id: socket.id,
                name: playerName,
                hand: [],
                score: 0,
                status: "playing",
              },
            ],
            currentPlayer: socket.id,
            gameStatus: "waiting",
            winner: null,
          },
        };

        rooms[roomId] = newRoom;
        socket.join(roomId);

        socket.emit("roomCreated", { roomId, code: roomCode });
        io.to(roomId).emit("gameState", newRoom.gameState);
      });

      // Join an existing room
      socket.on("joinRoom", ({ playerName, roomCode }: { playerName: string; roomCode: string }) => {
        const roomId = Object.keys(rooms).find((id) => rooms[id].code === roomCode);

        if (roomId && rooms[roomId]) {
          const room = rooms[roomId];

          // Add player to the game
          room.gameState.players.push({
            id: socket.id,
            name: playerName,
            hand: [],
            score: 0,
            status: "playing",
          });

          socket.join(roomId);
          socket.emit("joinedRoom", { roomId });
          io.to(roomId).emit("gameState", room.gameState);
        } else {
          socket.emit("error", { message: "Room not found" });
        }
      });

      // Start the game
      socket.on("startGame", ({ roomId }: { roomId: string }) => {
        const room = rooms[roomId];

        if (room && room.hostId === socket.id) {
          // Deal initial cards
          const deck = createDeck();
          shuffleDeck(deck);

          // Deal two cards to each player
          room.gameState.players.forEach((player) => {
            player.hand = [drawCard(deck), drawCard(deck)];
            player.score = calculateScore(player.hand);
            player.status = "playing";
          });

          // Deal cards to dealer (one face down)
          room.gameState.dealerHand = [drawCard(deck), { ...drawCard(deck), hidden: true }];

          room.gameState.gameStatus = "playing";
          room.gameState.currentPlayer = room.gameState.players[0].id;
          room.gameState.winner = null;

          io.to(roomId).emit("gameState", room.gameState);
        }
      });

      // Player hits
      socket.on("hit", ({ roomId, playerId }: { roomId: string; playerId: string }) => {
        const room = rooms[roomId];

        if (room && room.gameState.currentPlayer === playerId) {
          const player = room.gameState.players.find((p) => p.id === playerId);

          if (player && player.status === "playing") {
            const deck = createDeck();
            shuffleDeck(deck);

            // Draw a card
            player.hand.push(drawCard(deck));
            player.score = calculateScore(player.hand);

            // Check if player busted
            if (player.score > 21) {
              player.status = "busted";
              nextPlayer(room);
            }

            io.to(roomId).emit("gameState", room.gameState);
          }
        }
      });

      // Player stands
      socket.on("stand", ({ roomId, playerId }: { roomId: string; playerId: string }) => {
        const room = rooms[roomId];

        if (room && room.gameState.currentPlayer === playerId) {
          const player = room.gameState.players.find((p) => p.id === playerId);

          if (player) {
            player.status = "standing";
            nextPlayer(room);
            io.to(roomId).emit("gameState", room.gameState);
          }
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

        // Remove player from any rooms they were in
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId];
          const playerIndex = room.gameState.players.findIndex((p) => p.id === socket.id);

          if (playerIndex !== -1) {
            room.gameState.players.splice(playerIndex, 1);

            // If room is empty, delete it
            if (room.gameState.players.length === 0) {
              delete rooms[roomId];
            }
            // If host left, assign new host
            else if (room.hostId === socket.id) {
              room.hostId = room.gameState.players[0].id;
              io.to(roomId).emit("gameState", room.gameState);
            }
          }
        });
      });
    });
  }

  return io;
}

// Helper function to move to the next player
function nextPlayer(room: Room) {
  const currentPlayerIndex = room.gameState.players.findIndex((p) => p.id === room.gameState.currentPlayer);
  let nextPlayerIndex = (currentPlayerIndex + 1) % room.gameState.players.length;

  // Find the next player who can play
  while (nextPlayerIndex !== currentPlayerIndex && room.gameState.players[nextPlayerIndex].status !== "playing") {
    nextPlayerIndex = (nextPlayerIndex + 1) % room.gameState.players.length;
  }

  // If we've gone through all players or no one can play
  if (nextPlayerIndex === currentPlayerIndex || room.gameState.players[nextPlayerIndex].status !== "playing") {
    dealerPlay(room);
  } else {
    room.gameState.currentPlayer = room.gameState.players[nextPlayerIndex].id;
  }
}

// Dealer's turn
function dealerPlay(room: Room) {
  // Reveal dealer's hidden card
  room.gameState.dealerHand.forEach((card) => (card.hidden = false));

  // Calculate dealer's score
  let dealerScore = calculateScore(room.gameState.dealerHand);

  // Dealer draws until score is at least 17
  const deck = createDeck();
  shuffleDeck(deck);

  while (dealerScore < 17) {
    room.gameState.dealerHand.push(drawCard(deck));
    dealerScore = calculateScore(room.gameState.dealerHand);
  }

  // Determine winner
  determineWinner(room);
}

// Determine the winner
function determineWinner(room: Room) {
  const dealerScore = calculateScore(room.gameState.dealerHand);
  const dealerBusted = dealerScore > 21;

  let highestScore = dealerBusted ? 0 : dealerScore;
  let winnerId = dealerBusted ? null : "dealer";

  // Check each player's score
  room.gameState.players.forEach((player) => {
    if (player.status !== "busted" && player.score > highestScore && player.score <= 21) {
      highestScore = player.score;
      winnerId = player.id;
    }
  });

  room.gameState.winner = winnerId;
  room.gameState.gameStatus = "finished";
}

// Helper functions for the game
function createDeck(): CardType[] {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck: CardType[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  return deck;
}

function shuffleDeck(deck: CardType[]): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard(deck: CardType[]): CardType {
  return deck[Math.floor(Math.random() * deck.length)];
}

function calculateScore(cards: CardType[]): number {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.hidden) continue;

    if (["J", "Q", "K"].includes(card.value)) {
      score += 10;
    } else if (card.value === "A") {
      score += 11;
      aces += 1;
    } else {
      score += Number.parseInt(card.value);
    }
  }

  // Adjust for aces
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

// Generate a unique room ID
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Generate a human-readable room code
function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API route handler
export async function GET(req: NextApiRequest) {
  try {
    initSocketServer();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Socket initialization error:", error);
    return NextResponse.json({ error: "Failed to initialize socket server" }, { status: 500 });
  }
}

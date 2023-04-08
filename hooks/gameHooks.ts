// hooks/gameHooks.ts
import { useState } from "react";

export function useGameSettings() {
  const [players, setPlayers] = useState(4);

  return {
    players,
    setPlayers,
  };
}

export function useGameStatus() {
  const [currentPlayer, setCurrentPlayer] = useState(-1);
  const [gameEnded, setGameEnded] = useState(false);
  const [looser, setLooser] = useState(-1);

  return {
    currentPlayer,
    setCurrentPlayer,
    gameEnded,
    setGameEnded,
    looser: looser,
    setLooser: setLooser,
  };
}

export function usePlayerCards(players: number) {
  const initialPlayerCards = Array.from({ length: players }, () => []);
  const [playerCards, setPlayerCards] = useState(initialPlayerCards);

  return {
    playerCards,
    setPlayerCards,
  };
}

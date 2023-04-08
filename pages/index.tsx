import React from "react";
import styles from "./index.module.css";
import { shuffleDeck } from "../lib/deck";
import { dealCards } from "../lib/dealCards";
import {
  selectStartingPlayer,
  getNextPlayer,
  compareCards,
  isPlayerOutOfCards,
  discardDuplicateCards,
  getWinningPlayers,
} from "../lib/game";
import {
  useGameSettings,
  useGameStatus,
  usePlayerCards,
} from "../hooks/gameHooks";

function Home() {
  const { players, setPlayers } =
    useGameSettings();
  const {
    currentPlayer,
    setCurrentPlayer,
    gameEnded,
    setGameEnded,
    looser: looser,
    setLooser: setLooser,
  } = useGameStatus();
  const { playerCards, setPlayerCards } = usePlayerCards(players);

  const startGame = () => {
    const shuffledDeck = shuffleDeck();
    const dealtCards = dealCards(shuffledDeck, players);
    const noDuplicateCards = dealtCards.map((cards) => discardDuplicateCards(cards));
    const startingPlayer = selectStartingPlayer(players);
    setPlayerCards(noDuplicateCards);
    setCurrentPlayer(startingPlayer);
    setGameEnded(false);
    setLooser(-1);
  };

  const playTurn = () => {
    // 次のプレイヤーを決定する
    const nextPlayer = getNextPlayer(currentPlayer, playerCards);

    if (playerCards[currentPlayer]) {
      // 現在のプレイヤーが1枚のカードを取る
      const currentCard = playerCards[currentPlayer].pop()!;

      // 取ったカードと手札のカードを比較する
      const sameCards = compareCards(currentCard, playerCards[currentPlayer]);
      if (sameCards.length > 0) {
        // 同じカードがあれば、捨てる
        setPlayerCards((prevState) => {
          const newState = [...prevState];
          newState[currentPlayer] = prevState[currentPlayer].filter(
            (card) => !sameCards.includes(card)
          );
          return newState;
        });
      }
    }

    // 現在のプレイヤーが次のプレイヤーになる
    setCurrentPlayer(nextPlayer);

    // 手札が0枚になったプレイヤーを退場させる
    setPlayerCards((prevState) =>
      prevState.filter((cards) => !isPlayerOutOfCards(cards))
    );

    // ゲームが終了したかどうかを確認する
    const remainingPlayers = playerCards.filter(
      (cards) => !isPlayerOutOfCards(cards)
    ).length;
    if (remainingPlayers === 1) {
      // ゲームが終了したら敗者を決定する
      const looserIndex = playerCards.findIndex(
        (cards) => !isPlayerOutOfCards(cards)
      );
      setLooser(looserIndex);
      setGameEnded(true);
    }
  };

return (
  <div className={styles.container}>
    <div className={styles.inputGroup}>
      <label htmlFor="players" className={styles.label}>
        プレイヤー人数:
      </label>
      <input
        id="players"
        type="number"
        value={players}
        onChange={(event) => setPlayers(Number(event.target.value))}
        className={styles.input}
      />
    </div>
    <div className={styles.customButtonWrapper}>
      <button onClick={startGame} className={styles.customButton}>
        ゲームを開始
      </button>
    </div>
    {gameEnded ? (
      <div>
        {looser >= 0 ? (
          <div>
            <h2>勝ち プレイヤー{getWinningPlayers(players, looser)}です！</h2>
            <h2>負け プレイヤー{looser + 1}です！</h2>
          </div>
        ) : (
          <div>
            <h2>ゲームが終了しましたが、敗者はいませんでした。</h2>
          </div>
        )}
      </div>
    ) : (
      <div>
        <h2>現在のプレイヤー: プレイヤー{currentPlayer + 1}</h2>
        <div>
          <h3>あなたのカード:</h3>
          <ul className={styles.cardsList}>
            {currentPlayer >= 0 && playerCards[currentPlayer]
              ? playerCards[currentPlayer].map((card, index) => (
                  <li key={index} className={styles.cardItem}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card}>
                        <div
                          className={`${styles.cardFace} ${styles.cardFront} ${
                            card.suit.toLowerCase() === "♠" ||
                            card.suit.toLowerCase() === "♣"
                              ? styles.black
                              : styles.red
                          }`}
                        >
                          <div className={styles.cardValue}>{card.value}</div>
                          <div className={styles.cardSuit}>{card.suit}</div>
                        </div>
                        <div
                          className={`${styles.cardFace} ${styles.cardBack}`}
                        >
                          ?
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </div>
        <button onClick={playTurn} className={styles.customButton}>
          カードを取る
        </button>
      </div>
    )}
  </div>
);


}

export default Home;

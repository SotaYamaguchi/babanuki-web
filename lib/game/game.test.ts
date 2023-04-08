import { shuffleDeck } from "../deck";
import { dealCards } from "../dealCards";
import {
  selectStartingPlayer,
  getNextPlayer,
  compareCards,
  isPlayerOutOfCards,
  discardDuplicateCards,
  getWinningPlayers,
} from "./game";

type Card = {
  value: string;
  suit: string;
};

describe("Bubba Bubba game", () => {
  const players = 4;
  let deck: Card[];
  let playerCards: Card[][];

  beforeEach(() => {
    // カードを配る
    deck = shuffleDeck();
    playerCards = dealCards(deck, players);

    // 重複したカードを捨てる
    playerCards = playerCards.map((cards) => discardDuplicateCards(cards));
  });

  test("ゲームが正しく進行する", () => {
    // プレイヤーを初期化する
    const startingPlayer = selectStartingPlayer(players);
    let currentPlayer = startingPlayer;

    // ゲームが終了するまで繰り返す
    while (
      playerCards.filter((cards) => !isPlayerOutOfCards(cards)).length > 1
    ) {
      // 次のプレイヤーを決定する
      const nextPlayer = getNextPlayer(currentPlayer, playerCards);

      if (!isPlayerOutOfCards(playerCards[currentPlayer])) {
        // 現在のプレイヤーが1枚のカードを取る
        const currentCard = playerCards[currentPlayer].pop()!;

        // 取ったカードと手札のカードを比較する
        const sameCards = compareCards(currentCard, playerCards[currentPlayer]);
        if (sameCards.length > 0) {
          // 同じカードがあれば、捨てる
          playerCards[currentPlayer] = playerCards[currentPlayer].filter(
            (card) => !sameCards.includes(card)
          );
        }
      }

      // 現在のプレイヤーが次のプレイヤーになる
      currentPlayer = nextPlayer;
    }

    // ゲームが終了した時、最後に残ったプレイヤーが敗者
    const loserCards = playerCards.find((cards) => !isPlayerOutOfCards(cards));
    expect(loserCards).toBeTruthy();
  });

test("手札に同じ値のカードがないことを確認", () => {
  // Helper function to check if any cards with the same value exist in a hand
  function hasDuplicateValue(cards: Card[]): boolean {
    const cardValues = cards.map((card) => card.value);
    const uniqueValues = new Set(cardValues);
    return cardValues.length !== uniqueValues.size;
  }

  // プレイヤーを初期化する
  const startingPlayer = selectStartingPlayer(players);
  let currentPlayer = startingPlayer;

  // ゲームが終了するまで繰り返す
  while (playerCards.length > 1) {
    // 次のプレイヤーを決定する
    const nextPlayer = getNextPlayer(currentPlayer, playerCards);

    if (!isPlayerOutOfCards(playerCards[currentPlayer])) {
      // 現在のプレイヤーが1枚のカードを取る
      const currentCard = playerCards[currentPlayer].pop()!;

      // 取ったカードと手札のカードを比較する
      const sameCards = compareCards(currentCard, playerCards[currentPlayer]);
      if (sameCards.length > 0) {
        // 同じカードがあれば、捨てる
        playerCards[currentPlayer] = playerCards[currentPlayer].filter(
          (card) => !sameCards.includes(card)
        );
      }

      // Check if there are no cards with the same value in each player's hand
      playerCards.forEach((cards) => {
        if (cards) {
          expect(hasDuplicateValue(cards)).toBeFalsy();
        }
      });
    }

    // 現在のプレイヤーが次のプレイヤーになる
    currentPlayer = nextPlayer;

    // 手札が0枚になったプレイヤーを退場させる
    playerCards = playerCards.filter((cards) => !isPlayerOutOfCards(cards));
  }
});
});

describe("getWinningPlayers", () => {
  test("プレイヤー数から敗者以外のプレイヤーのインデックスをカンマ区切りで出力", () => {
    expect(getWinningPlayers(4, 2)).toBe("1, 2, 4");
    expect(getWinningPlayers(5, 0)).toBe("2, 3, 4, 5");
    expect(getWinningPlayers(3, 1)).toBe("1, 3");
  });

  test("すべてのプレイヤーが勝者（敗者が存在しない）場合", () => {
    expect(getWinningPlayers(4, -1)).toBe("1, 2, 3, 4");
  });

  test("プレイヤーが1人の場合", () => {
    expect(getWinningPlayers(1, 0)).toBe("");
    expect(getWinningPlayers(1, -1)).toBe("1");
  });
});

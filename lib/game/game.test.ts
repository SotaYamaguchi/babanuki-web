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

describe("getNextPlayer", () => {
  const playerCards: Card[][] = [
    [
      { value: "A", suit: "♠" },
      { value: "K", suit: "♦" },
    ],
    [
      { value: "Q", suit: "♥" },
      { value: "J", suit: "♣" },
    ],
    [
      { value: "10", suit: "♠" },
      { value: "9", suit: "♦" },
    ],
  ];

  it("should return the next player when the current player is not the last one", () => {
    const nextPlayer = getNextPlayer(1, playerCards);
    expect(nextPlayer).toBe(2);
  });

  it("should return the first player when the current player is the last one", () => {
    const nextPlayer = getNextPlayer(2, playerCards);
    expect(nextPlayer).toBe(0);
  });
});


describe("compareCards", () => {
  test("returns an array with the same value cards", () => {
    const currentCard: Card = { value: "5", suit: "♠" };
    const playerCards: Card[] = [
      { value: "3", suit: "♦" },
      { value: "5", suit: "♣" },
      { value: "5", suit: "♠" },
      { value: "A", suit: "♥" },
    ];

    const sameValueCards = compareCards(currentCard, playerCards);

    expect(sameValueCards).toEqual([
      { value: "5", suit: "♣" },
      { value: "5", suit: "♠" },
    ]);
  });

  test("returns an empty array if there are no same value cards", () => {
    const currentCard: Card = { value: "10", suit: "♦" };
    const playerCards: Card[] = [
      { value: "3", suit: "♦" },
      { value: "5", suit: "♣" },
      { value: "4", suit: "♠" },
      { value: "A", suit: "♥" },
    ];

    const sameValueCards = compareCards(currentCard, playerCards);

    expect(sameValueCards).toEqual([]);
  });
});

describe("isPlayerOutOfCards", () => {
  test("returns true for an empty hand", () => {
    const playerCards: Card[] = [];
    expect(isPlayerOutOfCards(playerCards)).toBe(true);
  });

  test("returns false for a non-empty hand", () => {
    const playerCards: Card[] = [
      { value: "5", suit: "♠" },
      { value: "Q", suit: "♣" },
      { value: "2", suit: "♦" },
    ];
    expect(isPlayerOutOfCards(playerCards)).toBe(false);
  });
});


describe("discardDuplicateCards関数のテスト", () => {
  test("手札に重複がある場合、重複を捨てた手札が返される", () => {
    const playerCards: Card[] = [
      { value: "A", suit: "♠" },
      { value: "2", suit: "♥" },
      { value: "A", suit: "♣" },
      { value: "Q", suit: "♦" },
      { value: "K", suit: "♠" },
    ];
    const expected: Card[] = [
      { value: "A", suit: "♠" },
      { value: "2", suit: "♥" },
      { value: "Q", suit: "♦" },
      { value: "K", suit: "♠" },
    ];

    expect(discardDuplicateCards(playerCards)).toEqual(expected);
  });

  test("手札に重複がない場合、手札がそのまま返される", () => {
    const playerCards: Card[] = [
      { value: "A", suit: "♠" },
      { value: "2", suit: "♥" },
      { value: "Q", suit: "♦" },
      { value: "K", suit: "♠" },
    ];

    expect(discardDuplicateCards(playerCards)).toEqual(playerCards);
  });

  test("手札が空の場合、空の配列が返される", () => {
    const playerCards: Card[] = [];

    expect(discardDuplicateCards(playerCards)).toEqual([]);
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

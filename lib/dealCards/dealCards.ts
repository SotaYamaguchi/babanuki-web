type Card = {
  value: string;
  suit: string;
};

/**
 * シャッフルしたトランプのデッキから、プレイヤーにカードを配る。
 * @param deck トランプのデッキ
 * @param players プレイヤー数
 * @returns プレイヤーに配られたカードの配列
 */
export function dealCards(deck: Card[], players: number): Card[][] {
  const playerCards: Card[][] = Array.from({ length: players }, () => []);

  while (deck.length > 0) {
    for (let i = 0; i < players && deck.length > 0; i++) {
      const card = deck.pop();
      if (card) {
        playerCards[i].push(card);
      }
    }
  }

  return playerCards;
}

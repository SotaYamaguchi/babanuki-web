type Card = {
  value: string;
  suit: string;
};

/**
 * プレイヤー数に応じて、ランダムに最初のプレイヤーを選択する
 * @param players プレイヤー数
 * @returns 最初のプレイヤーのID
 */
export function selectStartingPlayer(players: number): number {
  return Math.floor(Math.random() * players);
}

/**
 * 次のプレイヤーを決定する
 * @param currentPlayer 現在のプレイヤーのID
 * @param playerCards プレイヤーの手札
 * @returns 次のプレイヤーのID
 */
export function getNextPlayer(
  currentPlayer: number,
  playerCards: Card[][]
): number {
  let nextPlayer = currentPlayer + 1;
  if (nextPlayer >= playerCards.length) {
    nextPlayer = 0;
  }
  return nextPlayer;
}

/**
 * 取ったカードと手札のカードを比較する
 * @param currentCard 取ったカード
 * @param playerCards プレイヤーの手札
 * @returns 同じカードの配列
 */
export function compareCards(
  currentCard: Card,
  playerCards: Card[]
): Card[] {
  return playerCards.filter((card) => card.value === currentCard.value);
}

/**
 * プレイヤーが手札を持っていないかどうかを判断する
 * @param playerCards プレイヤーの手札
 * @returns プレイヤーが手札を持っていなければtrue、そうでなければfalse
 */
export function isPlayerOutOfCards(playerCards: Card[]): boolean {
  return playerCards.length === 0;
}

/**
 * プレイヤーの手札から重複したカードを捨てる
 * @param playerCards プレイヤーの手札
 * @returns 重複したカードを捨てた後の手札
 */
export function discardDuplicateCards(playerCards: Card[]): Card[] {
  const uniqueCards: Card[] = [];
  const seenValues = new Set<string>();

  for (const card of playerCards) {
    if (!seenValues.has(card.value)) {
      seenValues.add(card.value);
      uniqueCards.push(card);
    }
  }

  return uniqueCards;
}

export function getWinningPlayers(players: number, looser: number): string {
  const winningPlayers = [];

  for (let i = 0; i < players; i++) {
    if (i !== looser) {
      winningPlayers.push(i + 1);
    }
  }

  return winningPlayers.join(", ");
}
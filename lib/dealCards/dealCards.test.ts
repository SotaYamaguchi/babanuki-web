import { shuffleDeck } from "../deck";
import { dealCards } from "./dealCards";

describe("dealCards", () => {
  test("プレイヤーにトランプを配る", () => {
    const deck = shuffleDeck();
    const players = 4;
    const totalCards = deck.length;
    const playerCards = dealCards(deck, players);

    expect(playerCards).toHaveLength(players);
    let totalDealtCards = 0;
    playerCards.forEach((cards) => {
      totalDealtCards += cards.length;
    });
    expect(totalDealtCards).toEqual(totalCards);
  });


  test("デッキにはもうカードが残っていないことを確認", () => {
    const deck = shuffleDeck();
    const players = 2;
    const totalCards = deck.length;
    const cardsPerPlayer = Math.floor(totalCards / players);
    const playerCards = dealCards(deck, players);

    expect(deck).toHaveLength(0);

    const allCards = playerCards.flat();
    expect(allCards).toHaveLength(totalCards);

    const uniqueCards = new Set(allCards);
    expect(uniqueCards.size).toBe(totalCards);

    const cardCounts = playerCards.map((cards) => cards.length);
    const maxCount = Math.max(...cardCounts);
    const minCount = Math.min(...cardCounts);

    expect(maxCount - minCount).toBeLessThanOrEqual(1);
  });
});

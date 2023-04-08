import { shuffleDeck } from "./deck";

describe("shuffleDeck", () => {
  test("デッキをシャッフルする", () => {
    const deck = shuffleDeck();
    expect(deck).toHaveLength(53);

    // 同じカードが連続して出現する確率は極めて低いため、シャッフルされたことを確認する
    const firstCard = deck[0];
    let hasMatch = false;
    for (let i = 1; i < deck.length; i++) {
      if (
        deck[i].value === firstCard.value &&
        deck[i].suit === firstCard.suit
      ) {
        hasMatch = true;
        break;
      }
    }
    expect(hasMatch).toBe(false);

    // Jokerカードがデッキに含まれていることを確認する
    const jokerCard = deck.find((card) => card.value === "JOKER");
    expect(jokerCard).toBeTruthy();
  });
});

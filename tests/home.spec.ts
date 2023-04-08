import { test, expect } from '@playwright/test';

test("should render correctly with default props", async ({ page }) => {
  // ページを開く
  await page.goto("http://localhost:3000/");

  // プレイヤー人数のデフォルト値が表示されていることを確認する
  const playerNumberInputValue = await page.$eval("#players", (el) =>
    el.getAttribute("value")
  );
  expect(playerNumberInputValue).toBe("4");

  // 「ゲームを開始」ボタンを押す
  await page.click("#__next > div > div:nth-child(2) > button");

  // 現在のプレイヤーのテキストが表示されていることを確認する
  const currentPlayerText = await page.$eval("h2", (el) => el.textContent);
  expect(currentPlayerText).toContain("現在のプレイヤー: プレイヤー");

  // カードを取るボタンを押す
  await page.click("#__next > div > div:nth-child(3) > button");

  // 次のプレイヤーに移ることを確認する
  const nextPlayerText = await page.$eval("h2", (el) => el.textContent);
  expect(nextPlayerText).toContain("現在のプレイヤー: プレイヤー");
});

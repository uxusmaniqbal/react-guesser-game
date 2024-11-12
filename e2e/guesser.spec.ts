import { test, expect } from "@playwright/test";

test.describe("Guesser Game", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("should render the initial UI with randon prompt", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /guess the number/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /guess an integer between 1 and/i,
      })
    ).toBeVisible();
  });
  test("should congratulate on a successful guess", async ({ page }) => {
    await page.getByTestId("inputEl").fill("3");
    await page.getByTestId("submitBtn").click();
    await expect(
      page.getByRole("heading", {
        name: /Congratulations! Great guess ✅ The random number was 3/i,
      })
    ).toBeVisible();
  });

  test("should display failure message and try again on wrong guess", async ({
    page,
  }) => {
    await page.getByTestId("inputEl").fill("2");
    await page.getByTestId("submitBtn").click();
    await expect(
      page.getByRole("heading", {
        name: /wrong Guess/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /try again/i,
      })
    ).toBeVisible();
  });

  test("should reset on try again click", async ({ page }) => {
    await page.getByTestId("inputEl").fill("2");
    await page.getByTestId("submitBtn").click();
    await page.getByRole("button", {
      name: /try again/i,
    }).click();
    await expect(
        page.getByRole("heading", {
          name: /guess an integer between 1 and/i,
        })
      ).toBeVisible();
  });
});

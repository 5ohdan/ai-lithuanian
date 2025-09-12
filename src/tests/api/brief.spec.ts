import { test, expect } from "@playwright/test";

test("unautorized rejection", async ({ request }) => {
  const response = await request.post("/api/words/brief");
  expect(response.status()).toBe(401);
  expect(response.statusText()).toBe("Unauthorized");
});

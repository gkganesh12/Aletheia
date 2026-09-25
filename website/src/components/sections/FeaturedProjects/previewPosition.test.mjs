import test from "node:test";
import assert from "node:assert/strict";
import { previewPosition } from "./previewPosition.mjs";
test("preview stays inside bottom-right edge", () => {
  assert.deepEqual(previewPosition(990, 690, 360, 240, 1000, 700), {
    left: 624,
    top: 444,
  });
});
test("oversized preview never starts outside small viewport", () => {
  assert.deepEqual(previewPosition(2, 2, 360, 240, 320, 220), {
    left: 0,
    top: 0,
  });
});
test("preview follows pointer with offset away from link", () => {
  assert.deepEqual(previewPosition(100, 300, 360, 240, 1440, 900), {
    left: 124,
    top: 180,
  });
});
test("top edge is bounded", () => {
  assert.equal(previewPosition(200, 2, 360, 240, 1440, 900).top, 0);
});

test("keyboard preview fits a short desktop viewport", async () => {
  const { keyboardPreviewPosition } = await import("./previewPosition.mjs");
  const p = keyboardPreviewPosition(360, 280, 900, 320);
  assert.ok(p.top >= 0 && p.top + 280 <= 320);
  assert.ok(p.left >= 0 && p.left + 360 <= 900);
});

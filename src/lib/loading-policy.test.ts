import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { canLoadHeroVideo, HERO_VIDEO_DELAY_MS } from "./loading-policy";

describe("hero video loading restrictions", () => {
  test("waits two seconds after page load", () => {
    assert.equal(HERO_VIDEO_DELAY_MS, 2000);
  });
  test("never loads below 768 pixels", () => {
    assert.equal(canLoadHeroVideo({ width: 767, reducedMotion: false, saveData: false }), false);
    assert.equal(canLoadHeroVideo({ width: 768, reducedMotion: false, saveData: false }), true);
  });
  test("does not load with reduced motion", () => {
    assert.equal(canLoadHeroVideo({ width: 1280, reducedMotion: true, saveData: false }), false);
  });
  test("does not load on data-saving connections", () => {
    assert.equal(canLoadHeroVideo({ width: 1280, reducedMotion: false, saveData: true }), false);
  });
});
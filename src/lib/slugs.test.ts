import { describe, it, expect } from "vitest";
import { toSlug, fromSlug, findCityBySlug, findCategoryBySlug } from "./slugs";

describe("toSlug", () => {
  it("lowercases and dash-separates", () => {
    expect(toSlug("New Delhi")).toBe("new-delhi");
    expect(toSlug("Photography & Media")).toBe("photography-media");
  });
});

describe("fromSlug", () => {
  it("title-cases dashes back to spaces", () => {
    expect(fromSlug("new-delhi")).toBe("New Delhi");
  });
});

describe("findCityBySlug", () => {
  it("finds Mumbai by slug", () => {
    expect(findCityBySlug("mumbai")?.name).toBe("Mumbai");
  });
  it("returns undefined for unknown", () => {
    expect(findCityBySlug("atlantis")).toBeUndefined();
  });
});

describe("findCategoryBySlug", () => {
  it("finds photography by id", () => {
    expect(findCategoryBySlug("photography")?.id).toBe("photography");
  });
});

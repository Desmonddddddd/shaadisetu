import { describe, it, expect } from "vitest";
import { toSlug, fromSlug, findCityBySlug, findCategoryBySlug, cityToSlug } from "./slugs";
import { cities } from "@/data/cities";

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

describe("toSlug edge cases", () => {
  it("returns empty for empty input", () => {
    expect(toSlug("")).toBe("");
  });
  it("collapses runs of separators to a single dash", () => {
    expect(toSlug("A & & B")).toBe("a-b");
    expect(toSlug("A   B")).toBe("a-b");
    expect(toSlug("A--B")).toBe("a-b");
  });
  it("trims leading and trailing punctuation", () => {
    expect(toSlug("!Mumbai!")).toBe("mumbai");
    expect(toSlug("  Delhi  ")).toBe("delhi");
  });
});

describe("findCategoryBySlug — unknown", () => {
  it("returns undefined for unknown id", () => {
    expect(findCategoryBySlug("rocketry")).toBeUndefined();
  });
});

describe("city slug disambiguation", () => {
  it("cityToSlug returns bare slug for unique city", () => {
    const mumbai = cities.find((c) => c.name === "Mumbai")!;
    expect(cityToSlug(mumbai)).toBe("mumbai");
  });

  it("cityToSlug appends state for colliding cities", () => {
    const udaipurRJ = cities.find((c) => c.name === "Udaipur" && c.state === "Rajasthan")!;
    const udaipurTR = cities.find((c) => c.name === "Udaipur" && c.state === "Tripura")!;
    expect(cityToSlug(udaipurRJ)).toBe("udaipur-rajasthan");
    expect(cityToSlug(udaipurTR)).toBe("udaipur-tripura");
  });

  it("findCityBySlug returns undefined for ambiguous bare slug", () => {
    // `udaipur` alone is ambiguous, so requiring the state suffix is correct.
    expect(findCityBySlug("udaipur")).toBeUndefined();
  });

  it("findCityBySlug resolves disambiguated slug to the right city", () => {
    expect(findCityBySlug("udaipur-rajasthan")?.state).toBe("Rajasthan");
    expect(findCityBySlug("udaipur-tripura")?.state).toBe("Tripura");
    expect(findCityBySlug("bilaspur-chhattisgarh")?.state).toBe("Chhattisgarh");
    expect(findCityBySlug("bilaspur-himachal-pradesh")?.state).toBe("Himachal Pradesh");
  });

  it("findCityBySlug still resolves unique cities by bare slug", () => {
    expect(findCityBySlug("mumbai")?.name).toBe("Mumbai");
    expect(findCityBySlug("new-delhi")?.name).toBe("New Delhi");
  });
});

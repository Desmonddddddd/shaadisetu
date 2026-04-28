import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CompareProvider, useCompare } from "./CompareContext";
import type { ReactNode } from "react";

function wrap({ children }: { children: ReactNode }) {
  return <CompareProvider>{children}</CompareProvider>;
}

beforeEach(() => localStorage.clear());

describe("CompareContext", () => {
  it("adds and removes vendor previews", () => {
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    act(() => { result.current.add({ id: "v1", name: "Lensman" }); });
    act(() => { result.current.add({ id: "v2", name: "Petals" }); });
    expect(result.current.ids).toEqual(["v1", "v2"]);
    expect(result.current.items.map((x) => x.name)).toEqual(["Lensman", "Petals"]);
    act(() => result.current.remove("v1"));
    expect(result.current.ids).toEqual(["v2"]);
  });

  it("caps at 3 — fourth add is rejected", () => {
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    act(() => { result.current.add({ id: "v1", name: "A" }); });
    act(() => { result.current.add({ id: "v2", name: "B" }); });
    act(() => { result.current.add({ id: "v3", name: "C" }); });
    let added = true;
    act(() => { added = result.current.add({ id: "v4", name: "D" }); });
    expect(added).toBe(false);
    expect(result.current.ids).toEqual(["v1", "v2", "v3"]);
  });

  it("hydrates from new-format localStorage (object array)", () => {
    localStorage.setItem(
      "shaadisetu.compare",
      JSON.stringify([{ id: "v7", name: "Seven" }, { id: "v8", name: "Eight" }]),
    );
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    expect(result.current.ids).toEqual(["v7", "v8"]);
    expect(result.current.items[0].name).toBe("Seven");
  });

  it("migrates legacy string-array localStorage", () => {
    localStorage.setItem("shaadisetu.compare", JSON.stringify(["v9", "v10"]));
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    expect(result.current.ids).toEqual(["v9", "v10"]);
  });
});

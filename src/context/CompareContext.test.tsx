import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CompareProvider, useCompare } from "./CompareContext";
import type { ReactNode } from "react";

function wrap({ children }: { children: ReactNode }) {
  return <CompareProvider>{children}</CompareProvider>;
}

beforeEach(() => localStorage.clear());

describe("CompareContext", () => {
  it("adds and removes vendors", () => {
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    act(() => { result.current.add("v1"); });
    act(() => { result.current.add("v2"); });
    expect(result.current.ids).toEqual(["v1", "v2"]);
    act(() => result.current.remove("v1"));
    expect(result.current.ids).toEqual(["v2"]);
  });

  it("caps at 3 — fourth add is rejected", () => {
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    act(() => { result.current.add("v1"); });
    act(() => { result.current.add("v2"); });
    act(() => { result.current.add("v3"); });
    let added = true;
    act(() => { added = result.current.add("v4"); });
    expect(added).toBe(false);
    expect(result.current.ids).toEqual(["v1", "v2", "v3"]);
  });

  it("hydrates from localStorage", () => {
    localStorage.setItem("shaadisetu.compare", JSON.stringify(["v7", "v8"]));
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    expect(result.current.ids).toEqual(["v7", "v8"]);
  });
});

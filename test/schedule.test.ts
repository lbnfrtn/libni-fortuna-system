import { describe, it, expect } from "vitest";
import { buildSchedule } from "@/lib/orders";
import { splitInstalments } from "@/lib/util";

const NOW = new Date("2026-09-17T00:00:00Z").getTime();

describe("splitInstalments", () => {
  it("splits evenly and puts remainder on the first payment", () => {
    expect(splitInstalments(250000, 3)).toEqual([83334, 83333, 83333]);
    expect(splitInstalments(250000, 3).reduce((a, b) => a + b, 0)).toBe(250000);
  });
  it("handles a single payment", () => {
    expect(splitInstalments(7777, 1)).toEqual([7777]);
  });
});

describe("buildSchedule", () => {
  it("pay in full is one instalment due today", () => {
    const s = buildSchedule("full", 7777, { now: NOW });
    expect(s).toHaveLength(1);
    expect(s[0]).toMatchObject({ n: 1, amountPHP: 7777, dueDate: "2026-09-17" });
  });

  it("3 instalments: first due now, then monthly, summing to total", () => {
    const s = buildSchedule("instalment", 250000, { instalmentCount: 3, now: NOW });
    expect(s.map((x) => x.dueDate)).toEqual(["2026-09-17", "2026-10-17", "2026-11-17"]);
    expect(s.reduce((a, b) => a + b.amountPHP, 0)).toBe(250000);
    expect(s[0].dueDate).toBe("2026-09-17"); // first due at signing
  });

  it("deposit: 30% now, balance later", () => {
    const s = buildSchedule("deposit", 100000, { depositFraction: 0.3, balanceDueDate: "2026-12-01", now: NOW });
    expect(s[0].amountPHP).toBe(30000);
    expect(s[1].amountPHP).toBe(70000);
    expect(s[1].dueDate).toBe("2026-12-01");
  });
});

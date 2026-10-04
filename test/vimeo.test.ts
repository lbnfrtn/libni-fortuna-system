import { describe, it, expect } from "vitest";
import { vimeoId, DEFAULT_LIBERATE_VIDEOS } from "@/config/liberate-videos";
import { enrichVideos } from "@/lib/vimeo";

describe("Liberate videos", () => {
  it("reads the id from any Vimeo link shape", () => {
    expect(vimeoId("https://vimeo.com/1232675915")).toBe("1232675915");
    expect(vimeoId("https://player.vimeo.com/video/1232675915?h=abc")).toBe("1232675915");
    expect(vimeoId("https://youtube.com/watch?v=x")).toBeNull();
  });
  it("a Studio-pasted link to a known video keeps Libni's name, intake and poster (no network)", async () => {
    const [v] = await enrichVideos(["https://player.vimeo.com/video/1232675915"]);
    expect(v.name).toBe("Kimi");
    expect(v.role).toContain("Liberate 4");
    expect(v.quote).toBeTruthy();
    expect(v.poster).toContain("vid-1232675915");
    expect(DEFAULT_LIBERATE_VIDEOS).toHaveLength(10);
  });
});

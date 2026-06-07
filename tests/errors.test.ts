import { describe, it, expect } from "vitest";
import { AppError } from "@/lib/errors";

describe("lib/errors", () => {
  it("기본값은 500 + internal_error", () => {
    const err = new AppError("boom");
    expect(err.status).toBe(500);
    expect(err.code).toBe("internal_error");
    expect(err.message).toBe("boom");
  });

  it("status·code를 override 할 수 있다", () => {
    const err = new AppError("nope", { status: 400, code: "invalid_input" });
    expect(err.status).toBe(400);
    expect(err.code).toBe("invalid_input");
  });

  it("trackingId가 자동 발급되며 UUID 형태(36자, 하이픈 4개)다", () => {
    const err = new AppError("boom");
    expect(typeof err.trackingId).toBe("string");
    expect(err.trackingId).toHaveLength(36);
    expect(err.trackingId.split("-")).toHaveLength(5);
    // 두 번 생성 시 서로 다른 ID
    const other = new AppError("boom");
    expect(err.trackingId).not.toBe(other.trackingId);
  });

  it("trackingId는 opts로 override 할 수 있다", () => {
    const fixed = "11111111-2222-3333-4444-555555555555";
    const err = new AppError("boom", { trackingId: fixed });
    expect(err.trackingId).toBe(fixed);
  });

  it("toJSON()은 { error, trackingId } 를 반환한다", () => {
    const err = new AppError("ignored-message", {
      code: "not_found",
      trackingId: "abc",
    });
    expect(err.toJSON()).toEqual({ error: "not_found", trackingId: "abc" });
  });
});

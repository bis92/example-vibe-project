import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/concepts/[slug]/route";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function callGet(slug: string) {
  return GET(new Request(`http://localhost/api/concepts/${slug}`), {
    params: Promise.resolve({ slug }),
  });
}

describe("GET /api/concepts/[slug]", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("없는 slug 호출 시 404 + trackingId(UUID) 를 반환하고 로그에 같은 ID가 남는다", async () => {
    const res = await callGet("does-not-exist");
    expect(res.status).toBe(404);

    const body = (await res.json()) as { error: string; trackingId: string };
    expect(body.error).toBe("not_found");
    expect(body.trackingId).toMatch(UUID_RE);

    // 로그 라인에 같은 trackingId 가 들어가 있어야 한다
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const loggedLine = errorSpy.mock.calls[0]?.[0] as string;
    expect(loggedLine).toContain(body.trackingId);
    // 구조화 로그(JSON) 형태인지 가볍게 확인
    const parsed = JSON.parse(loggedLine) as Record<string, unknown>;
    expect(parsed.level).toBe("error");
    expect(parsed.trackingId).toBe(body.trackingId);
    expect(parsed.slug).toBe("does-not-exist");
  });

  it("존재하는 slug 호출 시 200 + { concept } 응답 모양을 유지한다", async () => {
    const res = await callGet("agent-loop");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { concept: { slug: string } };
    expect(body.concept).toBeDefined();
    expect(body.concept.slug).toBe("agent-loop");
  });
});

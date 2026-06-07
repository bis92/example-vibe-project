import { NextResponse } from "next/server";
import { findConcept } from "@/lib/concepts";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const concept = findConcept(slug);
  if (!concept) {
    const err = new AppError("concept_not_found", {
      status: 404,
      code: "not_found",
    });
    logger.error({
      module: "concepts",
      event: "not_found",
      slug,
      trackingId: err.trackingId,
    });
    return NextResponse.json(err.toJSON(), { status: err.status });
  }
  return NextResponse.json({ concept });
}

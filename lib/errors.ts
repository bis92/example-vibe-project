import { randomUUID } from "node:crypto";

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly trackingId: string;

  constructor(
    message: string,
    opts: { status?: number; code?: string; trackingId?: string } = {},
  ) {
    super(message);
    this.name = "AppError";
    this.status = opts.status ?? 500;
    this.code = opts.code ?? "internal_error";
    this.trackingId = opts.trackingId ?? randomUUID();
  }

  toJSON() {
    return { error: this.code, trackingId: this.trackingId };
  }
}

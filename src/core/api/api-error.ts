// A typed error for any failed API call. For now it just carries a message
// and the HTTP status so callers can `catch` something structured instead of
// a bare Error. Real error *handling* (mapping statuses to user messaging,
// retries, etc.) comes later — this only makes failures typed and catchable.

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

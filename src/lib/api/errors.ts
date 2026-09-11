// Standard DRF field-validation error shape: each key is a field name,
// each value is a list of message strings for that field.
// e.g. { "phone_number": ["This field may not be blank."] }
export type FieldErrors<T extends string = string> = Partial<
  Record<T, string[]>
>;

// Extracts a single human-readable message from an Axios error whose
// response body follows either of two DRF error shapes: the field-keyed
// FieldErrors shape above, or a plain array of message strings (seen on
// tier/usage-limit errors, e.g. ["You cannot create more than 2 clients
// on your current plan."]). Falls back to a generic message rather than
// ever showing raw JSON to the user.
//
// Endpoints with a genuinely different error shape (mixed
// {field: {detail: string}} objects) need their own extraction logic;
// don't route those through this helper.
export function getFieldErrorMessage(error: unknown): string {
  const data = (error as { response?: { data?: unknown } })?.response?.data;

  if (Array.isArray(data) && typeof data[0] === "string") {
    return data[0];
  }

  if (data && typeof data === "object") {
    const fieldErrors = data as FieldErrors;
    const firstField = Object.keys(fieldErrors)[0];
    const firstMessage = firstField ? fieldErrors[firstField]?.[0] : undefined;

    if (firstMessage) {
      return firstMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

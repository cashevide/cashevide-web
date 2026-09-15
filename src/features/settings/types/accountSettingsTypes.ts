// GET /users/profile/delete/ response — verified against
// Cashevide_API.yaml: description says "Account successfully deleted",
// matches Expo's `message` field naming for this endpoint.
export type DeleteAccountResponse = {
  message: string;
};

const apiUrl = import.meta.env.VITE_API_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!apiUrl) {
  throw new Error("VITE_API_URL is missing");
}

if (!googleClientId) {
  throw new Error("VITE_GOOGLE_CLIENT_ID is missing");
}

export const env = {
  apiUrl,
  googleClientId,
};

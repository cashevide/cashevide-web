const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is missing");
}

export const env = {
  apiUrl,
};

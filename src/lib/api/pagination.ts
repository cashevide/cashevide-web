// Extracts the `page` query param from a DRF-style pagination `next` URL
// ("https://api.cashevide.com/invoices/?page=2&search=..."). Returns
// undefined once `next` is null (no more pages) or the param is missing,
// which tells useInfiniteQuery's getNextPageParam to stop requesting
// further pages.
//
// Uses the browser's native URL/URLSearchParams — the Expo version used a
// plain regex because React Native's URL polyfill had documented
// reliability issues on native (facebook/react-native#38656). That
// concern doesn't apply here: this is a web-only build, and every
// evergreen browser implements the URL API natively.
//
// Shared across every list endpoint using DRF's standard
// {count, next, previous, results} pagination shape (invoices, clients,
// products, and any future list) rather than duplicated per feature.
export function getPageFromUrl(url: string | null): number | undefined {
  if (!url) return undefined;

  const page = new URL(url).searchParams.get("page");
  if (!page) return undefined;

  const pageNumber = Number(page);
  return Number.isNaN(pageNumber) ? undefined : pageNumber;
}

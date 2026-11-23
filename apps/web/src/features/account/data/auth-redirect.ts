export function isAuthReturn(hash: string): boolean {
  if (!hash.startsWith("#") || hash.startsWith("#/")) return false;
  const params = new URLSearchParams(hash.slice(1));
  return Boolean(params.get("access_token") && params.get("refresh_token"));
}
export function shouldOpenAccount(
  event: string,
  authReturn: boolean,
  pathname: string,
): boolean {
  return (
    event === "SIGNED_IN" &&
    authReturn &&
    pathname.replace(/\/$/, "") !== "/account"
  );
}

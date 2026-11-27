export const isNavActive = (to: string, pathname: string, search: string) => {
  const [path, query] = to.split("?");
  if (path === "/") return pathname === "/";
  if (pathname !== path && !pathname.startsWith(`${path}/`)) return false;

  const current = new URLSearchParams(search);
  if (query) {
    const wanted = new URLSearchParams(query);
    return [...wanted].every(([k, v]) => current.get(k) === v);
  }
  //Məhsullarlinki filtr olanda aktiv olmasın
  return !(path === "/product" && current.has("category"));
};
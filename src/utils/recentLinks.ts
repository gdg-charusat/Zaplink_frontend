import { type RecentLink } from "../types/recentLink";

const STORAGE_KEY = "recent_links";

const normalizeRecentLink = (link: Partial<RecentLink>): RecentLink => {
  const idValue = typeof link.id === "number" ? link.id : Number(link.id);
  const id = Number.isFinite(idValue) ? idValue : Date.now();

  return {
    id,
    url: typeof link.url === "string" ? link.url : "",
    createdAt:
      typeof link.createdAt === "string"
        ? link.createdAt
        : new Date().toISOString(),
  };
};

export const getRecentLinks = (): RecentLink[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((link) => normalizeRecentLink(link));
  } catch {
    return [];
  }
};

export const saveRecentLink = (newLink: RecentLink): void => {
  const existing = getRecentLinks();
  const normalized = normalizeRecentLink(newLink);

  const filtered = existing.filter((link) => link.id !== normalized.id);

  const updated = [normalized, ...filtered].slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteRecentLink = (id: number): void => {
  const existing = getRecentLinks();
  const updated = existing.filter(
    (link) => link.id !== id
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
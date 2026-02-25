import { type RecentLink } from "../types/recentLink";

const STORAGE_KEY = "recent_links";

export const getRecentLinks = (): RecentLink[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecentLink = (newLink: RecentLink): void => {
  const existing = getRecentLinks();

  const filtered = existing.filter(
    (link) => link.id !== newLink.id
  );

  const updated = [newLink, ...filtered].slice(0, 10);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};

export const deleteRecentLink = (id: number): void => {
  const existing = getRecentLinks();
  const updated = existing.filter(
    (link) => link.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};
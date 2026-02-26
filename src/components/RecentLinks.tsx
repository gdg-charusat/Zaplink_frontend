import { useEffect, useState } from "react";
import { type RecentLink } from "../types/recentLink";
import {
  getRecentLinks,
  deleteRecentLink,
} from "../utils/recentLinks";

const RecentLinks = () => {
  const [links, setLinks] = useState<RecentLink[]>([]);

  useEffect(() => {
    setLinks(getRecentLinks());
  }, []);

  const handleDelete = (id: number) => {
    deleteRecentLink(id);
    setLinks(getRecentLinks());
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">
        Recently Generated Links
      </h2>

      {links.length === 0 && (
        <p className="text-sm text-gray-500">
          No recent links
        </p>
      )}

      {links.map((link) => (
        <div
          key={link.id}
          className="flex justify-between items-center mb-2"
        >
          <span className="truncate w-40">
            {link.url}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(link.url)}
              className="text-blue-500 text-sm"
            >
              Copy
            </button>

            <button
              onClick={() =>
                window.open(link.url, "_blank")
              }
              className="text-green-500 text-sm"
            >
              Open
            </button>

            <button
              onClick={() => handleDelete(link.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentLinks;
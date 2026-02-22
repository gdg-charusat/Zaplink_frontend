import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  LinkIcon,
  Type,
  FileXIcon as DocxIcon,
  Presentation,
  ExternalLink,
  Calendar,
  Eye,
} from "lucide-react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { InfiniteScrollList } from "./InfiniteScrollList";
import { cn } from "../lib/utils";
import axios from "axios";

// ─── Types ───

interface ZapItem {
  _id: string;
  shortId: string;
  name: string;
  type: string;
  createdAt: string;
  viewCount?: number;
  maxViews?: number;
  expiresAt?: string;
  url?: string;
}

// Map content types to icons and colors
const typeConfig: Record<
  string,
  { icon: typeof FileText; color: string; label: string }
> = {
  pdf: {
    icon: FileText,
    color: "from-red-500 to-red-600",
    label: "PDF",
  },
  image: {
    icon: ImageIcon,
    color: "from-blue-500 to-blue-600",
    label: "Image",
  },
  video: {
    icon: Video,
    color: "from-purple-500 to-purple-600",
    label: "Video",
  },
  audio: {
    icon: Music,
    color: "from-pink-500 to-pink-600",
    label: "Audio",
  },
  url: {
    icon: LinkIcon,
    color: "from-green-500 to-green-600",
    label: "URL",
  },
  text: {
    icon: Type,
    color: "from-yellow-500 to-yellow-600",
    label: "Text",
  },
  document: {
    icon: DocxIcon,
    color: "from-indigo-500 to-indigo-600",
    label: "Document",
  },
  presentation: {
    icon: Presentation,
    color: "from-orange-500 to-orange-600",
    label: "Presentation",
  },
};

const defaultType = {
  icon: FileText,
  color: "from-gray-500 to-gray-600",
  label: "File",
};

const PAGE_SIZE = 20;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const USE_MOCK_ZAPS =
  import.meta.env.VITE_USE_MOCK_ZAPS === "true" || !BACKEND_URL;
const MOCK_TOTAL_ITEMS = 1500;

function createMockZap(index: number): ZapItem {
  const types = [
    "pdf",
    "image",
    "video",
    "audio",
    "url",
    "text",
    "document",
    "presentation",
  ];
  const type = types[index % types.length];

  return {
    _id: `mock-${index + 1}`,
    shortId: `mock${index + 1}`,
    name: `Demo Zap ${index + 1}`,
    type,
    createdAt: new Date(Date.now() - index * 60_000).toISOString(),
    viewCount: (index * 3) % 120,
    maxViews: 200,
  };
}

// ─── API fetcher ───

async function fetchZapsPage(
  page: number
): Promise<{ items: ZapItem[]; hasMore: boolean }> {
  if (USE_MOCK_ZAPS) {
    const start = page * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, MOCK_TOTAL_ITEMS);
    const items = Array.from({ length: Math.max(0, end - start) }, (_, i) =>
      createMockZap(start + i)
    );

    return {
      items,
      hasMore: end < MOCK_TOTAL_ITEMS,
    };
  }

  const response = await axios.get(
    `${BACKEND_URL}/api/zaps`,
    {
      params: {
        page: page + 1,
        limit: PAGE_SIZE,
      },
      withCredentials: true,
    }
  );

  const data = response.data;

  // Support raw arrays
  if (Array.isArray(data)) {
    return {
      items: data,
      hasMore: data.length >= PAGE_SIZE,
    };
  }

  // Support common paginated response shapes
  const normalizedItems =
    data?.items ??
    data?.zaps ??
    data?.data?.items ??
    data?.data?.zaps ??
    data?.data ??
    data?.results ??
    data?.docs ??
    [];

  const itemCount = Array.isArray(normalizedItems)
    ? normalizedItems.length
    : 0;

  return {
    items: Array.isArray(normalizedItems) ? normalizedItems : [],
    hasMore:
      data?.hasMore ??
      data?.data?.hasMore ??
      (data?.nextPage !== undefined
        ? data.nextPage != null
        : undefined) ??
      itemCount >= PAGE_SIZE,
  };
}

// ─── Helper: relative time ───

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ─── Zap card component ───

function ZapCard({ item }: { item: ZapItem }) {
  const config = typeConfig[item.type] ?? defaultType;
  const Icon = config.icon;
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/zaps/${item.shortId}`)}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card",
        "hover:border-primary/30 hover:shadow-md transition-all duration-200",
        "text-left focus-ring group"
      )}
    >
      {/* Type icon */}
      <div
        className={cn(
          "shrink-0 p-3 rounded-xl bg-gradient-to-br shadow-sm",
          "group-hover:scale-110 transition-transform duration-200",
          config.color
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {item.name || item.shortId}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {timeAgo(item.createdAt)}
          </span>
          {item.viewCount !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.viewCount}
              {item.maxViews ? `/${item.maxViews}` : ""} views
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] uppercase font-semibold">
            {config.label}
          </span>
        </div>
      </div>

      {/* Open icon */}
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

// ─── Dashboard component ───

export default function Dashboard() {
  const {
    items,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    loadMore,
    retry,
    refresh,
  } = useInfiniteScroll<ZapItem>({
    fetchPage: fetchZapsPage,
    pageSize: PAGE_SIZE,
  });

  // Load first page on mount
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    (item: ZapItem, _index: number) => <ZapCard item={item} />,
    []
  );

  const getItemKey = useCallback(
    (item: ZapItem, index: number) => item._id ?? index,
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-3xl flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            My Zaps
          </h1>
          <p className="text-muted-foreground mt-1">
            All your shared files and links in one place.
          </p>
          {USE_MOCK_ZAPS && (
            <p className="text-xs text-primary mt-2">
              Running in mock mode. Set VITE_BACKEND_URL and VITE_USE_MOCK_ZAPS=false to use live data.
            </p>
          )}
        </div>

        {/* The infinite scroll list takes up the remaining height */}
        <div className="flex-1 min-h-0" style={{ height: "calc(100vh - 220px)" }}>
          <InfiniteScrollList<ZapItem>
            items={items}
            loadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            error={error}
            onRetry={retry}
            onRefresh={refresh}
            renderItem={renderItem}
            getItemKey={getItemKey}
            estimateSize={76}
            overscan={8}
            skeletonCount={8}
            loadMoreThreshold={5}
          />
        </div>
      </main>
    </div>
  );
}

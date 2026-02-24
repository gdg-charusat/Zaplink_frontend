import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Log {
  timestamp: string;
  device: string;
  browser: string;
}

export default function AnalyticsDashboard() {
  const { shortId } = useParams();
  const effectiveId = shortId || "demo";

  const [logs, setLogs] = useState<Log[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(7200);

  // Load logs + auto refresh
  useEffect(() => {
    const loadLogs = () => {
      const stored = JSON.parse(
        localStorage.getItem(`zap_analytics_${effectiveId}`) || "[]"
      );
      setLogs(stored);
    };

    loadLogs();
    const interval = setInterval(loadLogs, 3000);

    return () => clearInterval(interval);
  }, [effectiveId]);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalViews = logs.length;

  const deviceCounts = logs.reduce(
    (acc: any, log) => {
      acc[log.device] = (acc[log.device] || 0) + 1;
      return acc;
    },
    {}
  );

  const browserCounts = logs.reduce(
    (acc: any, log) => {
      acc[log.browser] = (acc[log.browser] || 0) + 1;
      return acc;
    },
    {}
  );

  const expired = timeLeft === 0;

  const percentageLeft = (timeLeft / 7200) * 100;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics for Zap: {effectiveId}
        </h1>

        {/* Total Views */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Total Views</h2>
          <p className="text-4xl font-bold text-primary">{totalViews}</p>
        </div>

        {/* Devices */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
          <div className="flex gap-8">
            <div><Smartphone /> {deviceCounts.Mobile || 0} Mobile</div>
            <div><Tablet /> {deviceCounts.Tablet || 0} Tablet</div>
            <div><Monitor /> {deviceCounts.Desktop || 0} Desktop</div>
          </div>
        </div>

        {/* Browsers */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Browser Breakdown</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(browserCounts).map(([browser, count]) => (
              <div key={browser} className="bg-muted px-4 py-2 rounded-lg">
                {browser}: {count as number}
              </div>
            ))}
          </div>
        </div>

        {/* Expiry */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Expiry Status</h2>

          {expired ? (
            <div className="flex items-center gap-2 text-red-500 font-semibold">
              <AlertCircle /> Expired
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
                <Clock /> Active
              </div>

              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-4 transition-all duration-1000"
                  style={{ width: `${percentageLeft}%` }}
                />
              </div>

              <div className="text-sm mt-2 text-muted-foreground">
                {Math.floor(timeLeft / 60)} minutes remaining
              </div>
            </>
          )}
        </div>

        {/* Access Logs */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Access Logs</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {logs.slice().reverse().map((log, index) => (
              <li key={index}>
                {new Date(log.timestamp).toLocaleString()} — {log.device} — {log.browser}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
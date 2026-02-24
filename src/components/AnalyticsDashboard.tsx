import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AnalyticsDashboard() {
  const { shortId } = useParams();
  const effectiveId = shortId || "demo";

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = JSON.parse(
        localStorage.getItem(`zap_analytics_${effectiveId}`) || "[]"
      );
      setLogs(stored);
    }, 1000);

    return () => clearInterval(interval);
  }, [effectiveId]);

  const totalViews = logs.length;

  const deviceCounts = logs.reduce((acc: any, log: any) => {
    acc[log.device] = (acc[log.device] || 0) + 1;
    return acc;
  }, {});

  const browserCounts = logs.reduce((acc: any, log: any) => {
    acc[log.browser] = (acc[log.browser] || 0) + 1;
    return acc;
  }, {});

  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10);

  const timeLeft = Math.max(
    0,
    Math.floor((expiryTime.getTime() - new Date().getTime()) / 1000)
  );

  return (
    <div className="min-h-screen p-10 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-xl border">
          <h2>Total Views</h2>
          <p className="text-2xl font-bold">{totalViews}</p>
        </div>

        <div className="p-6 bg-card rounded-xl border">
          <h2>Device Breakdown</h2>
          {Object.entries(deviceCounts).map(([key, value]) => (
            <p key={key}>
              {key}: {value as number}
            </p>
          ))}
        </div>

        <div className="p-6 bg-card rounded-xl border">
          <h2>Browser Breakdown</h2>
          {Object.entries(browserCounts).map(([key, value]) => (
            <p key={key}>
              {key}: {value as number}
            </p>
          ))}
        </div>
      </div>

      <div className="p-6 bg-card rounded-xl border">
        <h2>Recent Access Logs</h2>
        {logs.slice().reverse().map((log, i) => (
          <p key={i}>
            {new Date(log.timestamp).toLocaleString()} – {log.device} –{" "}
            {log.browser}
          </p>
        ))}
      </div>

      <div className="p-6 bg-card rounded-xl border">
        <h2>Expiry Countdown</h2>
        <p>{timeLeft > 0 ? `${timeLeft}s remaining` : "Expired"}</p>
      </div>
    </div>
  );
}
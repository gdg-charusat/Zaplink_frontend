import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  BarChart3,
  Users,
  Eye,
  ArrowLeft,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface AnalyticsRecord {
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
  accessedAt: string;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  analytics: AnalyticsRecord[];
}

const ZapAnalytics: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}/analytics`
        );
        setData(response.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch analytics. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (shortId) {
      fetchAnalytics();
    }
  }, [shortId]);

  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes("mobile")) return <Smartphone className="w-4 h-4" />;
    if (deviceLower.includes("tablet")) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              <CardTitle>Error</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.analytics.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Analytics Yet</CardTitle>
            <CardDescription>
              This Zap hasn't been accessed yet. Share the link to start
              collecting analytics!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Zap Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Insights for Zap ID: <span className="font-mono">{shortId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Views
              </CardTitle>
              <Eye className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {data.totalViews}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time access count
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Visitors
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {data.uniqueVisitors}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Distinct IP addresses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Access History</span>
            </CardTitle>
            <CardDescription>
              Detailed log of all Zap accesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>IP Address</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4" />
                        <span>Device</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Browser</span>
                      </div>
                    </TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Accessed At</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.analytics.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">
                        {record.ipAddress}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(record.device)}
                          <span className="capitalize">{record.device}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.browser}</TableCell>
                      <TableCell>{record.os}</TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatDate(record.accessedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZapAnalytics;

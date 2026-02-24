import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function ViewZapWrapper() {
  const location = useLocation();
  const passwordRequired =
    location.state && location.state.passwordRequired;

  return (
    <>
      <Navbar hideNavOptions={!!passwordRequired} />
      <ViewZap />
      <Footer />
    </>
  );
}

function AnalyticsWrapper() {
  return (
    <>
      <Navbar />
      <AnalyticsDashboard />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/upload" element={<><Navbar /><UploadPage /><Footer /></>} />
        <Route path="/customize" element={<><Navbar /><Customize /><Footer /></>} />
        <Route path="/how-it-works" element={<><Navbar /><HowItWorks /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><AboutUs /><Footer /></>} />

        {/* ✅ Demo Analytics */}
        <Route path="/analytics" element={<AnalyticsWrapper />} />

        {/* ✅ Per Zap Analytics */}
        <Route path="/analytics/:shortId" element={<AnalyticsWrapper />} />

        <Route path="/zaps/:shortId" element={<ViewZapWrapper />} />

        <Route path="/privacy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
        <Route path="/terms" element={<><Navbar /><Terms /><Footer /></>} />

        <Route path="*" element={<NotFound />} />

      </Routes>

      <ScrollToTop />
      <Analytics />
    </>
  );
}
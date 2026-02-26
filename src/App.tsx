import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
import ZapAnalytics from "./components/ZapAnalytics";
import AnalyticsLookup from "./components/AnalyticsLookup";
import UrlShortenerPage from "./components/UrlShortenerPage";
import Dashboard from "./components/Dashboard";
// import UrlShortenerPage from "./components/UrlShortenerPage";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { validateEnvironment } from "./lib/environment";
import ErrorBoundary from "./components/ErrorBoundary";

// Wrapper for ViewZap to show logo-only navbar if password is required
function ViewZapWrapper() {
  const location = useLocation();
  const passwordRequired = location.state && location.state.passwordRequired;
  return (
    <>
      <Navbar hideNavOptions={!!passwordRequired} />
      <ViewZap />
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Validate environment configuration on app startup
    validateEnvironment();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/upload"
          element={
            <>
              <Navbar />
              <UploadPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/customize"
          element={
            <>
              <Navbar />
              <Customize />
              <Footer />
            </>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <>
              <Navbar />
              <HowItWorks />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/analytics"
          element={
            <>
              <Navbar />
              <AnalyticsLookup />
              <Footer />
            </>
          }
        />
        <Route path="/zaps/:shortId" element={<ViewZapWrapper />} />
        <Route
          path="/zaps/:shortId/analytics"
          element={
            <>
              <Navbar />
              <ZapAnalytics />
              <Footer />
            </>
          }
        />
        {/* // <Route path="/url-shortener" element={<UrlShortenerPage />} /> */}
        <Route
          path="/url-shortener"
          element={
            <>
              <Navbar />
              <UrlShortenerPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        {/* <Route path="/privacy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} /> */}
        {/* <Route path="/terms" element={<><Navbar /><Terms /><Footer /></>} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </ErrorBoundary>
      <ScrollToTop />
      <Analytics />
    </>
  );
}

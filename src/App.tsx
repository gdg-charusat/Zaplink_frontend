import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
import Dashboard from "./components/Dashboard";
// import UrlShortenerPage from "./components/UrlShortenerPage";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
  return (
    <>
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
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route path="/zaps/:shortId" element={<ViewZapWrapper />} />
        {/* // <Route path="/url-shortener" element={<UrlShortenerPage />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  );
}

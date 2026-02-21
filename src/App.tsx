import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
// import UrlShortenerPage from "./components/UrlShortenerPage";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";

// Wrapper for ViewZap to show logo-only navbar if password is required
function ViewZapWrapper() {
  const location = useLocation();
  const passwordRequired = location.state && location.state.passwordRequired;
  return (
    <>
      <Navbar hideNavOptions={!!passwordRequired} />
      <ViewZap />
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
            </>
          }
        />
        <Route
          path="/upload"
          element={
            <>
              <Navbar />
              <UploadPage />
            </>
          }
        />
        <Route
          path="/customize"
          element={
            <>
              <Navbar />
              <Customize />
            </>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <>
              <Navbar />
              <HowItWorks />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutUs />
            </>
          }
        />
        <Route path="/zaps/:shortId" element={<ViewZapWrapper />} />
   <Route path="/url-shortener" element={<UrlShortenerPage />} />
      </Routes>
      <Analytics />
    </>
  );
}

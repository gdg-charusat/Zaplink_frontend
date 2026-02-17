import React from "react";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10">

      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

         
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              ZapLink
            </h2>
            <p className="text-sm leading-relaxed">
              Secure and fast file sharing platform.
              Share your files anytime, anywhere.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Navigation
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>

              <li>
                <a href="/features" className="hover:text-white transition">
                  Features
                </a>
              </li>

              <li>
                <a href="/pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>

              <li>
                <a href="/about" className="hover:text-white transition">
                  About
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

     
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Support
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <a href="/help" className="hover:text-white transition">
                  Help Center
                </a>
              </li>

              <li>
                <a href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

       
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Follow Us
            </h3>

            <div className="flex space-x-4 text-xl">

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaGithub />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaTwitter />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaLinkedin />
              </a>

            </div>
          </div>
        </div>

        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">

          © {new Date().getFullYear()} ZapLink. All rights reserved.

        </div>

      </div>
    </footer>
  );
};

export default Footer;

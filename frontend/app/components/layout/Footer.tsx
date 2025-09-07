import React from "react";
import { Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Personal Blog
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              A place where thoughts, ideas, and experiences come together.
              Sharing insights on technology, life, and everything in between.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="mailto:contact@example.com"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/blogs/new"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Write Post
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@example.com"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  contact@example.com
                </a>
              </li>
              <li>
                <p className="text-gray-600 text-sm">Built with Go + React</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Personal Blog. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { Link } from "react-router";
import Layout from "../components/layout/Layout";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go Home
            </Link>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Link
                to="/blogs"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Browse Blog Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

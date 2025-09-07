import { FileText, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout
      title="Page Not Found"
      className="flex flex-col items-center justify-center py-36"
    >
      <div className="mb-6">
        <FileText className="mx-auto h-16 w-16 text-gray-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Home
      </a>
    </Layout>
  );
};

export default NotFound;

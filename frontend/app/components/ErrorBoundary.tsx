import { Link } from "react-router";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

interface ErrorBoundaryProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

const ErrorBoundary = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  actionText = "Retry",
  actionHref = "/",
  onActionClick,
}: ErrorBoundaryProps) => {
  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else if (actionHref === "/") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col items-center justify-center flex-1 py-36">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          {onActionClick || actionHref === "/" ? (
            <button
              onClick={handleAction}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {actionText}
            </button>
          ) : (
            <Link
              to={actionHref}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {actionText}
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ErrorBoundary;

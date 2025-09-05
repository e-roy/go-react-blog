import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  backgroundImage?: string;
  className?: string;
}

const Layout = ({
  children,
  title,
  backgroundImage,
  className,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} backgroundImage={backgroundImage} />
      <div className={`container mx-auto px-2 py-12 max-w-6xl ${className}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

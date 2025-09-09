import { Settings } from "lucide-react";

interface FormHeaderProps {
  title: string;
  isEditing: boolean;
  onToggleMetadata: () => void;
  backgroundImage?: string;
  children?: React.ReactNode; // For the metadata dropdown
}

const FormHeader = ({
  title,
  isEditing,
  onToggleMetadata,
  backgroundImage,
  children,
}: FormHeaderProps) => {
  return (
    <header className="relative h-96 overflow-hidden">
      {/* Background Image or Gradient */}
      <div
        className={`absolute inset-0 ${
          backgroundImage
            ? "bg-cover bg-center bg-no-repeat"
            : "bg-gradient-to-br from-blue-300 to-sky-600"
        }`}
        style={
          backgroundImage
            ? {
                backgroundImage: `url('${backgroundImage}')`,
              }
            : {}
        }
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Navigation */}
        <div className="flex justify-end items-start p-6">
          {/* Metadata dropdown button */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMetadata}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 group"
              aria-label="Edit metadata"
            >
              <Settings className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
            </button>
            {children}
          </div>
        </div>

        {/* Centered Main Title */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white text-center">
            {title || (isEditing ? "Edit Blog Post" : "Create New Blog Post")}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default FormHeader;

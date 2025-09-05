import { X, Trash2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface MetadataDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    slug: string;
    meta_name: string;
    meta_description: string;
    published: boolean;
    title?: string;
  };
  errors: Record<string, string>;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onDelete?: () => void;
}

const MetadataDropdown = ({
  isOpen,
  onClose,
  formData,
  errors,
  isEditing,
  onInputChange,
  onDelete,
}: MetadataDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteModal(false);
      onClose(); // Close the metadata dropdown after successful deletion
    } catch (error) {
      console.error("Failed to delete blog:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-10" />
      <div className="fixed right-6 top-24 w-[90vw] sm:w-[70vw] lg:w-[40vw] bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Blog Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={onInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.slug ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="url-friendly-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {isEditing
                ? "Changing this will change the URL."
                : "Auto-generated from title, but you can customize it."}
            </p>
          </div>

          {/* Meta Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (SEO)
            </label>
            <input
              type="text"
              name="meta_name"
              value={formData.meta_name}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SEO title for search engines (optional)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to use the main title for SEO.
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={onInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description for search engines and social media (optional)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to auto-generate from content.
            </p>
          </div>

          {/* Published Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={onInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          {/* Delete Button - Only show when editing */}
          {isEditing && onDelete && (
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Blog Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${formData.title || "this blog post"}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};

export default MetadataDropdown;

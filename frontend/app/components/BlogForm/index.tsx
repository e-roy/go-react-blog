import { useState } from "react";
import Footer from "@/components/layout/Footer";
import type { CreateBlogRequest } from "@/types/generated";

import MarkdownEditor from "./MarkdownEditor";
import InlineEditableField from "./InlineEditableField";
import MetadataDropdown from "./MetadataDropdown";
import FormHeader from "./FormHeader";
import FormActions from "./FormActions";
import BlogMetaInfo from "./BlogMetaInfo";

interface BlogFormProps {
  onSubmit: (blogData: CreateBlogRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CreateBlogRequest>;
  isEditing?: boolean;
  onDelete?: () => Promise<void>;
}

const BlogForm = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  onDelete,
}: BlogFormProps) => {
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    author_name: initialData?.author_name || "",
    author_username: initialData?.author_username || "",
    published: initialData?.published || false,
    meta_name: initialData?.meta_name || "",
    meta_description: initialData?.meta_description || "",
    slug: initialData?.slug || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMetadataDropdown, setShowMetadataDropdown] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Function to check if there are changes
  const checkForChanges = (currentData: CreateBlogRequest) => {
    if (!initialData) {
      // For new posts, check if any field has content
      const hasContent = Object.values(currentData).some((value) =>
        typeof value === "string" ? value.trim() !== "" : value !== false
      );
      setHasChanges(hasContent);
      return;
    }

    // For editing, compare with initial data
    const hasChanges = Object.keys(currentData).some((key) => {
      const currentValue = currentData[key as keyof CreateBlogRequest];
      const initialValue = initialData[key as keyof CreateBlogRequest];

      if (
        typeof currentValue === "string" &&
        typeof initialValue === "string"
      ) {
        return currentValue.trim() !== initialValue.trim();
      }

      return currentValue !== initialValue;
    });

    setHasChanges(hasChanges);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.author_name.trim()) {
      newErrors.author_name = "Author name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to save blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => {
        const newData = { ...prev, [name]: checked };
        checkForChanges(newData);
        return newData;
      });
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };

        // Auto-generate slug when title changes (only for new posts)
        if (name === "title" && !isEditing) {
          newData.slug = generateSlug(value);
        }

        // Auto-generate author_username when author_name changes
        if (name === "author_name") {
          newData.author_username = value.toLowerCase().replace(/\s+/g, "_");
        }

        checkForChanges(newData);
        return newData;
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const startEditing = (field: string) => {
    setEditingField(field);
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  const handleInlineEdit = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-generate slug when title changes (only for new posts)
      if (field === "title" && !isEditing) {
        newData.slug = generateSlug(value);
      }

      // Auto-generate author_username when author_name changes
      if (field === "author_name") {
        newData.author_username = value.toLowerCase().replace(/\s+/g, "_");
      }

      checkForChanges(newData);
      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader
        title={formData.title}
        isEditing={isEditing}
        onToggleMetadata={() => setShowMetadataDropdown(!showMetadataDropdown)}
      >
        <MetadataDropdown
          isOpen={showMetadataDropdown}
          onClose={() => setShowMetadataDropdown(false)}
          formData={{
            slug: formData.slug,
            meta_name: formData.meta_name,
            meta_description: formData.meta_description,
            published: formData.published,
            title: formData.title,
          }}
          errors={errors}
          isEditing={isEditing}
          onInputChange={handleInputChange}
          onDelete={onDelete}
        />
      </FormHeader>

      <div className="container mx-auto px-2 py-12 max-w-6xl">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Header with title and actions */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                {/* Blog Title */}
                <div className="flex-1 min-w-0">
                  <InlineEditableField
                    field="title"
                    value={formData.title}
                    placeholder="Enter blog post title..."
                    className="text-3xl lg:text-4xl font-bold text-gray-900 min-h-[2.5rem] lg:min-h-[3rem] flex items-center"
                    isEditing={editingField === "title"}
                    onStartEditing={startEditing}
                    onStopEditing={stopEditing}
                    onValueChange={handleInlineEdit}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex-shrink-0">
                  <FormActions
                    isSubmitting={isSubmitting}
                    isEditing={isEditing}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                    hasChanges={hasChanges}
                  />
                </div>
              </div>
            </div>

            {/* Blog Meta Information */}
            <BlogMetaInfo
              authorName={formData.author_name}
              errors={errors}
              isEditing={editingField === "author_name"}
              onStartEditing={startEditing}
              onStopEditing={stopEditing}
              onValueChange={handleInlineEdit}
            />

            {/* Content Section */}
            <div className="mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Content</h2>
              </div>

              <div>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => {
                    setFormData((prev) => {
                      const newData = { ...prev, content: value };
                      checkForChanges(newData);
                      return newData;
                    });
                    // Clear error when user starts typing
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: "" }));
                    }
                  }}
                  placeholder="# Welcome to Your Blog Post

Write your content here using **markdown** formatting.

## Features
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Lists like this one

## Code Examples
```javascript
console.log('Hello, World!');
```

Happy writing!"
                  rows={20}
                  className={errors.content ? "border-red-300" : ""}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
            </div>
          </div>
        </article>
        <Footer />
      </div>
    </div>
  );
};

export default BlogForm;

import { User, Calendar } from "lucide-react";
import InlineEditableField from "./InlineEditableField";

interface BlogMetaInfoProps {
  authorName: string;
  errors: Record<string, string>;
  isEditing: boolean;
  onStartEditing: (field: string) => void;
  onStopEditing: () => void;
  onValueChange: (field: string, value: string) => void;
}

const BlogMetaInfo = ({
  authorName,
  errors,
  isEditing,
  onStartEditing,
  onStopEditing,
  onValueChange,
}: BlogMetaInfoProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          By: <User className="w-4 h-4 mr-1" />
          <InlineEditableField
            field="author_name"
            value={authorName}
            placeholder="Enter author name"
            className="font-medium text-gray-700 hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
            isEditing={isEditing}
            onStartEditing={onStartEditing}
            onStopEditing={onStopEditing}
            onValueChange={onValueChange}
          />
        </div>
        <span className="mx-2">•</span>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      {errors.author_name && (
        <p className="text-sm text-red-600 mt-1">{errors.author_name}</p>
      )}
    </div>
  );
};

export default BlogMetaInfo;

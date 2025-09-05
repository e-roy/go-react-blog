import { Loader2, Save, X } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  hasChanges: boolean;
}

const FormActions = ({
  isSubmitting,
  isEditing,
  onSubmit,
  onCancel,
  hasChanges,
}: FormActionsProps) => {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        title="Cancel"
        aria-label="Cancel"
      >
        <X className="w-4 h-4" />
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !hasChanges}
        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={
          !hasChanges
            ? "No changes to save"
            : isEditing
              ? "Update Blog Post"
              : "Create Blog Post"
        }
        aria-label={
          !hasChanges
            ? "No changes to save"
            : isEditing
              ? "Update Blog Post"
              : "Create Blog Post"
        }
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default FormActions;

import { Edit3 } from "lucide-react";

interface InlineEditableFieldProps {
  field: string;
  value: string;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  isEditing: boolean;
  onStartEditing: (field: string) => void;
  onStopEditing: () => void;
  onValueChange: (field: string, value: string) => void;
}

const InlineEditableField = ({
  field,
  value,
  placeholder,
  className = "",
  multiline = false,
  isEditing,
  onStartEditing,
  onStopEditing,
  onValueChange,
}: InlineEditableFieldProps) => {
  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onValueChange(field, e.target.value)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === "Escape") onStopEditing();
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onStopEditing();
              }
            }}
            className={`w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onValueChange(field, e.target.value)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === "Escape") onStopEditing();
              if (e.key === "Enter") {
                e.preventDefault();
                onStopEditing();
              }
            }}
            className={`w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
            autoFocus
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onStartEditing(field)}
      className={`cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors border border-transparent hover:border-gray-200 group ${className}`}
      title={`Click to edit ${field}`}
    >
      <div className="flex items-center justify-between">
        <span>{value || placeholder}</span>
        <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default InlineEditableField;

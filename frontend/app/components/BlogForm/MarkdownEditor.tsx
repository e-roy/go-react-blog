import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  Type,
} from "lucide-react";
import MarkdownContent from "../MarkdownContent";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Write your content here using markdown formatting...",
  className = "",
  rows = 15,
}: MarkdownEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper function to insert text at cursor position
  const insertText = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newText =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);
    onChange(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Toolbar button actions
  const toolbarActions = {
    bold: () => insertText("**", "**", "bold text"),
    italic: () => insertText("*", "*", "italic text"),
    heading1: () => insertText("# ", "", "Heading 1"),
    heading2: () => insertText("## ", "", "Heading 2"),
    heading3: () => insertText("### ", "", "Heading 3"),
    link: () => insertText("[", "](https://example.com)", "link text"),
    code: () => insertText("`", "`", "code"),
    codeBlock: () => insertText("```\n", "\n```", "code block"),
    quote: () => insertText("> ", "", "quote"),
    unorderedList: () => insertText("- ", "", "list item"),
    orderedList: () => insertText("1. ", "", "list item"),
  };

  // Toolbar button component
  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title,
    isActive = false,
  }: {
    onClick: () => void;
    icon: any;
    title: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
        isActive ? "bg-blue-100 text-blue-600" : "text-gray-600"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-1">
          <ToolbarButton
            onClick={toolbarActions.bold}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={toolbarActions.italic}
            icon={Italic}
            title="Italic"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <ToolbarButton
            onClick={toolbarActions.heading1}
            icon={Heading1}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={toolbarActions.heading2}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={toolbarActions.heading3}
            icon={Heading3}
            title="Heading 3"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <ToolbarButton
            onClick={toolbarActions.link}
            icon={Link}
            title="Link"
          />
          <ToolbarButton
            onClick={toolbarActions.code}
            icon={Code}
            title="Inline Code"
          />
          <ToolbarButton
            onClick={toolbarActions.codeBlock}
            icon={Type}
            title="Code Block"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <ToolbarButton
            onClick={toolbarActions.quote}
            icon={Quote}
            title="Quote"
          />
          <ToolbarButton
            onClick={toolbarActions.unorderedList}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={toolbarActions.orderedList}
            icon={ListOrdered}
            title="Numbered List"
          />
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`p-2 rounded-md transition-colors ${
              !isPreview
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Edit Mode"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`p-2 rounded-md transition-colors ${
              isPreview
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Preview Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div className="p-4 min-h-[400px]">
            {value ? (
              <MarkdownContent
                content={value}
                className="prose prose-sm max-w-none"
              />
            ) : (
              <div className="text-gray-400 italic">
                Nothing to preview. Start typing to see your content here.
              </div>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-4 border-0 resize-none focus:outline-none focus:ring-0 font-mono text-sm"
            style={{ minHeight: `${rows * 1.5}rem` }}
          />
        )}
      </div>

      {/* Footer with character count */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        {isPreview ? (
          <span>Preview Mode</span>
        ) : (
          <span>{value.length} characters</span>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { FiX } from "react-icons/fi";

interface TagInputProps {
  value: string[];
  placeholder?: string;
  onChange: (tags: string[]) => void;
}

const TagInput = ({ value, placeholder, onChange }: TagInputProps) => {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="adm-tags">
      {value.map((tag) => (
        <span key={tag} className="adm-tag">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
            <FiX size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
    </div>
  );
};

export default TagInput;
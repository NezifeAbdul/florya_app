import { useEffect, useMemo, useRef } from "react";
import type { ChangeEvent } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { imageUrl } from "../../utils/admin/imageUrl"

interface ImageUploadProps {
  files: File[];
  existing?: string[];
  multiple?: boolean;
  onChange: (files: File[]) => void;
}

const ImageUpload = ({ files, existing = [], multiple = false, onChange }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    onChange(multiple ? [...files, ...picked] : picked.slice(0, 1));
    e.target.value = "";
  };

  const removeAt = (index: number) => onChange(files.filter((_, i) => i !== index));

  const showExisting = multiple || files.length === 0;

  return (
    <div className="adm-upload">
      {showExisting &&
        existing.map((src) => (
          <div className="adm-upload__item" key={src}>
            <img src={imageUrl(src)} alt="" />
          </div>
        ))}

      {previews.map((src, i) => (
        <div className="adm-upload__item" key={src}>
          <img src={src} alt="" />
          <button type="button" onClick={() => removeAt(i)} aria-label="Remove">
            <FiX size={12} />
          </button>
        </div>
      ))}

      <button type="button" className="adm-upload__add" onClick={() => inputRef.current?.click()}>
        <FiPlus />
        <span>{multiple ? "Add new" : "Choose"}</span>
      </button>

      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden onChange={handlePick} />
    </div>
  );
};

export default ImageUpload;
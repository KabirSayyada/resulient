
import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Users can only upload their own photo. No generic avatars.
 * If no photo is uploaded, nothing will display.
 */
interface AvatarSelectorProps {
  value?: string | null;
  onChange: (url: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ value, onChange }) => {
  const [uploadUrl, setUploadUrl] = useState<string | null>(value || null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadUrl(reader.result as string);
      onChange(reader.result as string); // Save data URL for now
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-2">
        <label className="relative group cursor-pointer">
          <span className="rounded-full w-14 h-14 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 hover:border-indigo-600 transition-all">
            <span className="text-indigo-500 font-bold text-xl">+</span>
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="absolute opacity-0 inset-0 cursor-pointer"
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        {uploadUrl && (
          <img
            src={uploadUrl}
            alt="Selected avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
          />
        )}
      </div>
    </div>
  );
};

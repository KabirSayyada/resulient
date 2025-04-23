
import React, { useState } from "react";
import { cn } from "@/lib/utils";

// New viral avatars: animals, cartoons, minimalists, patterns etc. 
const PREMADE_AVATARS = [
  {
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=unicorn",
    label: "Unicorn"
  },
  {
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=robo-viral",
    label: "Robo Viral"
  },
  {
    url: "https://api.dicebear.com/7.x/icons/svg?seed=catstar",
    label: "Star Cat"
  },
  {
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=owlviral",
    label: "Owl Viral"
  },
  {
    url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixelhero",
    label: "Pixel Hero"
  },
  {
    url: "https://api.dicebear.com/7.x/shapes/svg?seed=patternviral",
    label: "Pattern Viral"
  },
  {
    url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=partyhazard",
    label: "Party Emoji"
  },
];

interface AvatarSelectorProps {
  value?: string | null;
  onChange: (url: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ value, onChange }) => {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

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
        {PREMADE_AVATARS.map((a) => (
          <button
            key={a.url}
            type="button"
            className={cn(
              "rounded-full border-2 transition-shadow focus:ring-2",
              value === a.url ? "border-indigo-600 ring-2" : "border-gray-200"
            )}
            onClick={() => onChange(a.url)}
            title={a.label}
          >
            <img src={a.url} alt={a.label} className="w-14 h-14 rounded-full object-cover" />
          </button>
        ))}
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
        {(value || uploadUrl) && (
          <img
            src={value || uploadUrl!}
            alt="Selected avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
          />
        )}
      </div>
    </div>
  );
};

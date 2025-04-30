
import React from 'react';
import { History } from 'lucide-react';

interface CachedResultIndicatorProps {
  isCached: boolean;
}

export const CachedResultIndicator = ({ isCached }: CachedResultIndicatorProps) => {
  if (!isCached) return null;
  
  return (
    <div className="absolute top-0 left-0 m-4 z-10 flex gap-2 items-center">
      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
        <History className="w-3 h-3 mr-1" /> Cached Result
      </div>
    </div>
  );
};

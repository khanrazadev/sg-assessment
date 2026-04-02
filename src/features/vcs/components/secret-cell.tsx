'use client';

import { useState } from 'react';
import { Clipboard, Check, Eye, EyeOff } from 'lucide-react';

interface SecretCellProps {
  secret: string;
}

export const SecretCell = ({ secret }: SecretCellProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    // Reset after 2s so user gets visual feedback without a persistent indicator
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-stone-100 rounded-[4px] py-1 px-1">
        <span className={`text-[10px] text-gray-700 font-mono leading-none ${!isRevealed && 'tracking-[0.25em] translate-y-[1px]'}`}>
          {isRevealed ? secret : '•••••••••••'}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={handleCopy} className="text-gray-600 hover:text-gray-900 focus:outline-none transition-colors">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Clipboard className="h-4 w-4" />}
        </button>
        <button onClick={() => setIsRevealed(!isRevealed)} className="text-gray-600 hover:text-gray-900 focus:outline-none transition-colors">
          {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

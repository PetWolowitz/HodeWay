import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Facebook, Twitter } from 'lucide-react';
import { Button } from '../../common/button';

interface ShareButtonProps {
  title: string;
  description?: string;
  url: string;
}

export function ShareButton({ title, description, url }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Check out my trip: ${title}${description ? ` - ${description}` : ''}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="relative">
      <Button
        
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShowMenu(!showMenu)}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={copyLink}
            >
              <LinkIcon className="h-4 w-4 mr-3" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={shareOnFacebook}
            >
              <Facebook className="h-4 w-4 mr-3" />
              Share on Facebook
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={shareOnTwitter}
            >
              <Twitter className="h-4 w-4 mr-3" />
              Share on Twitter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
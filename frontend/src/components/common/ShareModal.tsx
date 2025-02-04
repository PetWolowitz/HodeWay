import React, { useState } from 'react';
import { X, Mail, Link as LinkIcon, Download, Share2 } from 'lucide-react';
import { Button } from '../common/button';
import { CollaboratorsList } from "../features/collaborations/CollaboratorsList";
import type { Itinerary } from '../../types';

interface ShareModalProps {
  itinerary: Itinerary;
  onClose: () => void;
  onAddCollaborator: (email: string, role: 'editor' | 'viewer') => void;
  onRemoveCollaborator: (id: string) => void;
  collaborators: Array<{
    id: string;
    email: string;
    role: 'editor' | 'viewer';
  }>;
}

export function ShareModal({
  itinerary,
  onClose,
  onAddCollaborator,
  onRemoveCollaborator,
  collaborators
}: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onAddCollaborator(email, role);
      setEmail('');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const generatePDF = () => {
    // TODO: Implement PDF generation
    console.log('Generating PDF...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Share Itinerary</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Share Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
             
              className="flex items-center justify-center gap-2"
              onClick={copyLink}
            >
              <LinkIcon className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button

              className="flex items-center justify-center gap-2"
              onClick={generatePDF}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Add Collaborator Form */}
          <form onSubmit={handleAddCollaborator} className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Add Collaborators
            </h3>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <Button type="submit">Add</Button>
            </div>
          </form>

          {/* Collaborators List */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Current Collaborators
            </h3>
            <CollaboratorsList
              collaborators={collaborators}
              onRemove={onRemoveCollaborator}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
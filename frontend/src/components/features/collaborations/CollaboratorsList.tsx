import React from 'react';
import { User, UserMinus } from 'lucide-react';
import { Button } from '../../common/button';

interface Collaborator {
  id: string;
  email: string;
  role: 'editor' | 'viewer';
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  onRemove: (id: string) => void;
}

export function CollaboratorsList({ collaborators, onRemove }: CollaboratorsListProps) {
  return (
    <div className="space-y-4">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{collaborator.email}</p>
              <p className="text-xs text-gray-500 capitalize">{collaborator.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(collaborator.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
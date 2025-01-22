import { create } from 'zustand';
import type { User } from '../types';

interface Collaborator {
  id: string;
  email: string;
  role: 'editor' | 'viewer';
}

interface CollaborationState {
  collaborators: Record<string, Collaborator[]>; // itineraryId -> collaborators
  addCollaborator: (itineraryId: string, email: string, role: 'editor' | 'viewer') => void;
  removeCollaborator: (itineraryId: string, collaboratorId: string) => void;
  getCollaborators: (itineraryId: string) => Collaborator[];
}

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  collaborators: {},

  addCollaborator: (itineraryId, email, role) => {
    set((state) => {
      const currentCollaborators = state.collaborators[itineraryId] || [];
      const newCollaborator: Collaborator = {
        id: crypto.randomUUID(),
        email,
        role,
      };

      return {
        collaborators: {
          ...state.collaborators,
          [itineraryId]: [...currentCollaborators, newCollaborator],
        },
      };
    });
  },

  removeCollaborator: (itineraryId, collaboratorId) => {
    set((state) => {
      const currentCollaborators = state.collaborators[itineraryId] || [];
      return {
        collaborators: {
          ...state.collaborators,
          [itineraryId]: currentCollaborators.filter((c) => c.id !== collaboratorId),
        },
      };
    });
  },

  getCollaborators: (itineraryId) => {
    return get().collaborators[itineraryId] || [];
  },
}));
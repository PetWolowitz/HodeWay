import React, { useState } from 'react';
import { Calendar, MapPin, FileText, Share2, Download } from 'lucide-react';
import type { Itinerary } from '../../../types';
import { format } from 'date-fns';
import { Button } from '../../common/button';
import { ShareModal } from "../../common/ShareModal";

import { generateItineraryPDF } from '../../../lib/pdf';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onEdit: (id: string) => void;
}

export function ItineraryCard({ itinerary, onEdit }: ItineraryCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const pdfBlob = await generateItineraryPDF(itinerary, {
        includeTransports: true,
        includeExpenses: true,
        includeMap: true
      });
      
      // Crea un URL per il download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${itinerary.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{itinerary.title}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="text-gray-500 hover:text-gray-700"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{itinerary.description || 'No description provided'}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {format(new Date(itinerary.start_date), 'MMM d, yyyy')} - {format(new Date(itinerary.end_date), 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{itinerary.destinations.length} destinations</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button
            onClick={() => onEdit(itinerary.id)}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          itinerary={itinerary}
          onClose={() => setShowShareModal(false)}
          onAddCollaborator={(email, role) => {
            // Implementa la logica di aggiunta collaboratore
            console.log('Add collaborator:', email, role);
          }}
          onRemoveCollaborator={(id) => {
            // Implementa la logica di rimozione collaboratore
            console.log('Remove collaborator:', id);
          }}
          collaborators={[]} // Passa i collaboratori effettivi
        />
      )}
    </div>
  );
}
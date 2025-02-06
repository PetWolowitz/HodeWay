import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/common/button';

export function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute min-w-full min-h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="relative z-10 min-h-screen container mx-auto py-12 px-4">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome {user?.full_name || user?.email}</h1>
          <p className="text-xl">Start planning your next adventure</p>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => navigate('/trips')}
            className="flex items-center gap-2 text-lg"
          >
            <Plus className="w-6 h-6" />
            Create Your Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}
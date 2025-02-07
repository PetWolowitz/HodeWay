import { Users, Heart, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export function About() {
  const cards = [
    {
      title: "Mission",
      description: "To create unforgettable travel experiences and connect adventurers worldwide.",
      Icon: Users,
      bgImage: "/images/mission-bg.jpg",
      hoverImage: "/images/mission-hover.jpg"
    },
    {
      description: "Authenticity, adventure, and meaningful connections drive everything we do.",
      Icon: Heart,
      bgImage: "/images/values-bg.jpg",
      hoverImage: "/images/values-hover.jpg"
    },
    {
      description: "A passionate group of travelers and developers making your journey special.",
      Icon: Coffee,
      bgImage: "/images/team-bg.jpg",
      hoverImage: "/images/team-hover.jpg"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#F5E6CB]"> {/* Aggiunto colore mappa vecchia */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-sm md:text-5xl font-bold text-center py-6 text-black mb-8 drop-shadow-[0_4px_8px_rgba(75,75,75,1)]">About Us</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {cards.map((card, index) => (
            <div key={index} className="max-w-xs w-full mx-auto">
              <div
                className={cn(
                  "group w-full cursor-pointer overflow-hidden relative h-96 rounded-xl shadow-xl",
                  "flex flex-col justify-between p-6", // Cambiato da justify-end a justify-between                   
                  "transition-all duration-500",
                  "after:absolute after:inset-0 after:bg-black/60 after:z-0",
                  "shadow-[0_3px_10px_rgb(0,0,0,0.2)]",
                  "hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
                )}
              >
                {/* Background Image */}
                <div
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out"
                />
                {/* Hover Image */}
                <div
                  style={{ backgroundImage: `url(${card.hoverImage})` }}
                  className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                />

                {/* Content */}
                <div className="relative z-20">
                  <card.Icon className="w-12 h-12 text-white" /> {/* Spostata in alto */}
                </div>
                <div className="text relative z-20">
                  <p className="text-white text-center text-lg font-medium tracking-wide drop-shadow-[6px_6px_6px_rgba(75,75,75,1)]">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
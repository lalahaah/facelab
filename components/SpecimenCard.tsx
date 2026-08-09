import React, { forwardRef } from 'react';
import { AccentColor } from '@/types/quiz';
import { QuizConfig } from '@/config/quizzes';

interface SpecimenCardProps {
  imageUrl?: string;
  quiz: QuizConfig;
  label: string;
  accuracy: number;
  rarityText: string;
  cardNumber: string;
  stats: { label: string; value: number }[];
  rarityTier: 'common' | 'uncommon' | 'rare';
}

const SpecimenCard = forwardRef<HTMLDivElement, SpecimenCardProps>(
  ({ imageUrl, quiz, label, accuracy, rarityText, cardNumber, stats, rarityTier }, ref) => {
    
    const starCount = rarityTier === 'common' ? 1 : rarityTier === 'uncommon' ? 2 : 3;
    const accentVar = `var(--color-${quiz.accentColor})`;

    return (
      <div 
        ref={ref}
        className="relative w-full max-w-[320px] aspect-[5/7] rounded-2xl bg-ink text-paper p-5 flex flex-col mx-auto overflow-hidden shadow-2xl border-[3px]"
        style={{ borderColor: accentVar }}
      >
        {/* Holographic overlay for rare */}
        {rarityTier === 'rare' && (
          <div className="absolute inset-0 z-50 pointer-events-none opacity-20 holographic-overlay mix-blend-screen" />
        )}

        {/* Top bar */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-line/20">
          <span className="catalog-tag text-[10px]" style={{ color: accentVar }}>
            FACELAB SPECIMEN
          </span>
          <span className="font-mono text-xs text-paper/70">
            No.{cardNumber}
          </span>
        </div>

        {/* Stars */}
        <div className="flex justify-center mb-4 gap-1 text-sm">
          {[1, 2, 3].map((star) => (
            <span 
              key={star} 
              style={{ color: star <= starCount ? accentVar : 'rgba(245, 246, 242, 0.2)' }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Image */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-1/2 aspect-square rounded-xl overflow-hidden shadow-inner flex items-center justify-center bg-paper/10"
            style={{ boxShadow: `0 0 0 2px ${accentVar}` }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={imageUrl} 
                alt="Specimen" 
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="text-paper/20 text-xs">No Image</div>
            )}
          </div>
        </div>

        {/* Result Label */}
        <div className="text-center mb-6">
          <p className="font-display font-black text-6xl mb-1">{label}</p>
          <p className="text-xs font-mono text-paper/60 tracking-wider">일치율 {accuracy}%</p>
        </div>

        {/* Stats */}
        <div className="flex-1 flex flex-col gap-3 justify-center mb-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="font-mono text-[10px] w-12 text-right text-paper/60">{stat.label}</span>
              <div className="flex-1 h-1.5 bg-paper/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${stat.value}%`,
                    backgroundColor: accentVar,
                    animation: `growWidth 1s ease-out forwards`,
                    transformOrigin: 'left'
                  }}
                />
              </div>
              <span className="font-mono text-[10px] w-6 text-paper/80">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto text-center pt-4 border-t border-line/20">
          <p className="catalog-tag text-[9px] text-paper/50 mb-1">facelab.app</p>
          <p className="text-[11px] text-paper/80 font-medium">{rarityText}</p>
        </div>
      </div>
    );
  }
);

SpecimenCard.displayName = 'SpecimenCard';
export default SpecimenCard;

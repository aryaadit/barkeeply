import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, FolderOpen, Users, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WelcomeCarouselProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 'welcome',
    icon: Wine,
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    title: 'Welcome to Pour Decisions',
    subtitle: 'Your personal drink journal',
    description: 'Track every sip, from fine wines to craft cocktails. Rate, review, and remember your favorites.',
  },
  {
    id: 'library',
    icon: Sparkles,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500',
    title: 'Build Your Library',
    subtitle: 'Log drinks with ease',
    description: 'Add drinks with photos, ratings, and tasting notes. Your entire drink history in one place.',
  },
  {
    id: 'collections',
    icon: FolderOpen,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-500',
    title: 'Organize with Collections',
    subtitle: 'Curate your favorites',
    description: 'Create themed collections like "Summer Favorites" or "Gift Ideas" to organize drinks from your library.',
  },
  {
    id: 'social',
    icon: Users,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
    title: 'Connect & Discover',
    subtitle: 'Follow friends',
    description: 'See what your friends are drinking, share recommendations, and discover new favorites together.',
  },
];

export function WelcomeCarousel({ onComplete }: WelcomeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastSlide = currentIndex === slides.length - 1;

  const goToNext = useCallback(() => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastSlide, onComplete]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10 pt-[env(safe-area-inset-top)]">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onComplete}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={cn(
                'w-24 h-24 rounded-3xl flex items-center justify-center mb-8',
                currentSlide.iconBg
              )}
            >
              <currentSlide.icon className={cn('w-12 h-12', currentSlide.iconColor)} />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm font-medium text-primary uppercase tracking-wide mb-2"
            >
              {currentSlide.subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-display font-bold text-foreground mb-4"
            >
              {currentSlide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-muted-foreground leading-relaxed"
            >
              {currentSlide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="px-8 pb-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={goToPrev}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            variant="glow"
            size="lg"
            onClick={goToNext}
            className={cn('flex-1', currentIndex === 0 && 'w-full')}
          >
            {isLastSlide ? (
              <>
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ImageWithLoading = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  const displayPlaceholderImage = !isLoading && error;

  return (
    <>
      {isLoading && !error && (
        <div className={`flex h-[500px] w-1/2 flex-col space-y-3 ${className}`}>
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
      <img className={`max-h-[500px] ${className}`} src={displayPlaceholderImage ? 'no-image-placeholder.webp' : src} alt={alt} />
    </>
  );
};

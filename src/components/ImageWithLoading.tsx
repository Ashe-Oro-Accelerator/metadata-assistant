import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ImageWithLoading = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
  }, [src]);

  return isLoading ? (
    <div className="flex h-[500px] w-1/2 flex-col space-y-3">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  ) : (
    <img className="max-h-[500px]" src={src} alt={alt} />
  );
};

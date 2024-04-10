/*-
 *
 * Hedera Metadata Validator
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ImageWithLoading = ({
  src,
  alt,
  className,
  showSkeleton = true,
}: {
  src: string;
  alt: string;
  className?: string;
  showSkeleton?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  const displayPlaceholderImage = !isLoading && error;

  return (
    <>
      {showSkeleton && isLoading && !error && (
        <div className={`flex h-[500px] w-1/2 flex-col space-y-3 ${className}`}>
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
      <img className={`max-h-[400px] ${className}`} src={displayPlaceholderImage ? 'no-image-placeholder.webp' : src} alt={alt} />
    </>
  );
};

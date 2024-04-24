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
  image,
  alt,
  className,
  showSkeleton = true,
}: {
  image: string;
  alt: string;
  className?: string;
  showSkeleton?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  console.log('isLoading:', isLoading);
  const [error, setError] = useState(false);
  console.log('error:', error);

  useEffect(() => {
    if (!image) {
      setError(true);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadImage = () => {
      setIsLoading(true);
      setError(false);

      const img = new Image();
      img.src = image;
      img.onload = () => {
        if (isActive) {
          setIsLoading(false);
          setError(false);
        }
      };
      img.onerror = () => {
        if (isActive) {
          setError(true);
          setIsLoading(false);
        }
      };
    };

    loadImage();

    return () => {
      isActive = false;
    };
  }, [image]);

  return (
    <>
      {showSkeleton && isLoading && !error && (
        <div className={`flex h-[500px] w-1/2 flex-col space-y-3 ${className}`}>
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
      {!isLoading && <img className={`max-h-[400px] ${className}`} src={error ? 'no-image-placeholder.webp' : image} alt={alt} />}{' '}
    </>
  );
};

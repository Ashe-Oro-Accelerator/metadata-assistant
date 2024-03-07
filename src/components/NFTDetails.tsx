import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageWithLoading } from '@/components/ImageWithLoading';
import { dictionary } from '@/libs/en';
import { NFTDetailsType } from '@/utils/types/nftDetails';

export const NFTDetails = ({ nftDetailsList, activeId }: { nftDetailsList: NFTDetailsType[]; activeId: number }) => {
  const [currentId, setCurrentId] = useState(activeId);
  const { name, description, image, attributes } = nftDetailsList[currentId];

  const handlePrevious = useCallback(() => setCurrentId((oldId) => Math.max(oldId - 1, 0)), []);
  const handleNext = useCallback(() => setCurrentId((oldId) => Math.min(oldId + 1, nftDetailsList.length - 1)), [nftDetailsList.length]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{dictionary.modal.details}</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-[1300px] flex-col justify-between overflow-y-scroll md:h-[900px]">
        <DialogHeader>
          <DialogTitle>{dictionary.modal.modalTitle}</DialogTitle>
          <DialogDescription>{dictionary.modal.modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="hidden items-center justify-center md:flex">
              <ImageWithLoading src={image} alt={dictionary.modal.modalImageAlt} />
            </div>
            <div className="flex flex-col justify-start">
              <h2 className="mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 md:mb-20">{name}</h2>
              <div className="mb-10 flex items-center justify-center md:hidden">
                <ImageWithLoading src={image} alt={dictionary.modal.modalImageAlt} />
              </div>
              {description && (
                <div className="mb-6">
                  <p className="mb-2 text-lg font-semibold">{dictionary.modal.descriptionTitle}</p>
                  {description}
                </div>
              )}
              {attributes && (
                <div className="mb-6">
                  <p className="text-lg font-semibold">{dictionary.modal.attributesTitle}</p>
                  <ul className="ml-6 list-disc [&>li]:mt-2">
                    {attributes.map(({ trait_type, value }) => (
                      <li key={trait_type}>
                        {trait_type}: {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center gap-1">
          <Button className="w-full md:w-auto" disabled={currentId === 0} onClick={handlePrevious}>
            Previous
          </Button>
          <Button className="w-full md:w-auto" disabled={currentId === nftDetailsList.length - 1} onClick={handleNext}>
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { ImageWithLoading } from '@/components/ui/ImageWithLoading';
import { dictionary } from '@/libs/en';
import { MetadataObject, ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';
import { Attribute } from '@/utils/types/nftDetails';
import { getProperImageURL } from '@/utils/helpers/getProperImageURL';
import { DialogTitle } from '@radix-ui/react-dialog';

export const NFTDetails = ({
  metadataObject,
  fileName,
  activeId,
  metadataLength,
  handlePrevious,
  handleNext,
  validationResponse,
  isModalOpen,
  setIsModalOpen,
}: {
  metadataObject: MetadataObject;
  fileName: string;
  activeId: number;
  metadataLength: number;
  handlePrevious: () => void;
  handleNext: () => void;
  validationResponse: ValidateArrayOfObjectsResult;
  isModalOpen: boolean;
  setIsModalOpen: (_isOpen: boolean) => void;
}) => {
  const name = metadataObject?.name as string;
  const description = metadataObject?.description as string;
  const image = getProperImageURL(metadataObject?.image as string);
  const attributes = metadataObject?.attributes as Attribute[];
  const validationResult = validationResponse.results[activeId];
  const errorsPresent = !validationResult?.isValid;

  return (
    <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
      <DialogContent className="flex max-h-screen max-w-[1300px] flex-col justify-center md:h-[900px]">
        <DialogHeader>
          <DialogTitle>
            <span className="font-bold">{dictionary.modal.fileName}: </span>
            {fileName}
          </DialogTitle>
        </DialogHeader>
        <div className="h-full gap-4 py-4">
          <div className="grid grid-cols-1 items-start md:grid-cols-2 md:items-center">
            <div className="mb-auto flex hidden flex-col items-center justify-center pr-8 md:flex">
              <ImageWithLoading src={image} alt={dictionary.modal.modalImageAlt} showSkeleton={false} />
              {errorsPresent && (
                <div className="mt-6 w-full text-red-600">
                  <h3 className="font-semibold text-black">{dictionary.modal.thereAreErrors}:</h3>
                  {validationResult?.errors.map((error, index) => <p key={error + index}>{`${index + 1}) ${error}`}</p>)}
                </div>
              )}
            </div>
            <div className="mb-auto flex flex-col">
              <p>#{activeId + 1}</p>
              <h2 className="mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 md:mb-20">{name || '-'}</h2>
              <div className="mb-10 flex items-center justify-center md:hidden">
                <ImageWithLoading src={image} alt={dictionary.modal.modalImageAlt} showSkeleton={false} />
              </div>
              <div className="mb-6">
                <p className="mb-2 text-lg font-bold">{dictionary.modal.descriptionTitle}</p>
                {description || '-'}
              </div>
              {attributes?.length > 0 && (
                <div className="mb-6">
                  <p className="text-lg font-bold">{dictionary.modal.attributesTitle}</p>
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
          <Button className="w-full md:w-[100px]" disabled={activeId === 0} onClick={handlePrevious}>
            {dictionary.modal.previousButton}
          </Button>
          <Button className="w-full md:w-[100px]" disabled={activeId === metadataLength - 1} onClick={handleNext}>
            {dictionary.modal.nextButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

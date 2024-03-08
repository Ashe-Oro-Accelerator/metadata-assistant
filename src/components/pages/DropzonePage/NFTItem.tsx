/*-
 *
 * Hedera Metadata Assistant
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
import { DetailedFileValidationResult, MetadataObject } from 'hedera-nft-utilities';
import { TableCell, TableRow } from '@/components/ui/table';
import { ImageWithLoading } from '@/components/ui/ImageWithLoading';
import { getProperImageURL } from '@/utils/helpers/getProperImageURL';

interface NFTItemProps {
  metadata: MetadataObject;
  validationResult: DetailedFileValidationResult;
  children: React.ReactNode;
}

export const NFTItem = ({ metadata, validationResult = { isValid: false, errorsCount: 0, errors: [] }, children }: NFTItemProps) => {
  const { isValid, errorsCount } = validationResult;
  const name = metadata.name as string;
  const description = metadata.description as string;
  const image = getProperImageURL(metadata.image as string);

  return (
    <>
      <TableRow>
        <TableCell className="flex items-center">
          <ImageWithLoading src={image} alt={name} className="mr-6 max-h-[60px] max-w-[60px]" />
          {name || '-'}
        </TableCell>
        <TableCell>{description || '-'}</TableCell>
        <TableCell className={isValid ? 'text-green-500' : 'text-red-500'}>{isValid ? 'Passed' : 'Failed'}</TableCell>
        <TableCell>{errorsCount}</TableCell>
        <TableCell className="ml-auto text-right">{children}</TableCell>
      </TableRow>
    </>
  );
};

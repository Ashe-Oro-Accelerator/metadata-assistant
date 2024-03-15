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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/helpers/cn';
import { truncateString } from '@/utils/helpers/truncateString';

const TRUNCATE_NAME_NUMBER = 30;
const TRUNCATE_DESCRIPTION_NUMBER = 180;

interface NFTItemProps {
  metadata: MetadataObject;
  validationResult: DetailedFileValidationResult;
  children: React.ReactNode;
  index: number;
}

export const NFTItem = ({ metadata, validationResult = { isValid: false, errorsCount: 0, errors: [] }, children, index }: NFTItemProps) => {
  const { isValid, errorsCount } = validationResult;
  const name = metadata.name as string;
  const description = metadata.description as string;

  return (
    <TableRow>
      <TableCell>
        <span>{index + 1}</span>
      </TableCell>
      <TableCell>
        <span className="min-w-[150px]">{truncateString(name, TRUNCATE_NAME_NUMBER) || '-'}</span>
      </TableCell>
      <TableCell className="max-w-[450px]">{truncateString(description, TRUNCATE_DESCRIPTION_NUMBER) || '-'}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(isValid ? 'border-green-600 bg-green-200 text-green-600' : 'border-red-600 bg-red-200 text-red-600', 'border')}
        >
          {isValid ? 'Passed' : 'Failed'}
        </Badge>
      </TableCell>
      <TableCell>{errorsCount}</TableCell>
      <TableCell className="ml-auto text-right">{children}</TableCell>
    </TableRow>
  );
};

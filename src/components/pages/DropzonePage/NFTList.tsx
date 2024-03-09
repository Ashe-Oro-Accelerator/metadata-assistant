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
import { MetadataObject, ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TABLE_HEADERS } from '@/utils/constants/nftTableHeaders';
import { NFTItemWrapper } from '@/components/pages/DropzonePage/NFTItemWrapper';

interface NFTListProps {
  metadata: MetadataObject[];
  validationResponse: ValidateArrayOfObjectsResult;
}

export const NFTList = ({ metadata, validationResponse }: NFTListProps) => {
  return (
    <Table>
      <TableHeader className="font-semibold">
        <TableRow>
          {TABLE_HEADERS.map((head, index) => (
            <TableHead className="whitespace-nowrap font-semibold text-black" key={index}>
              {head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {metadata.map((item, index) => (
          <NFTItemWrapper key={index} item={item} index={index} metadata={metadata} validationResponse={validationResponse} />
        ))}
      </TableBody>
    </Table>
  );
};

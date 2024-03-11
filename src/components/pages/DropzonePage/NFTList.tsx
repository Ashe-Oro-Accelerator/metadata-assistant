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
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TABLE_HEADERS } from '@/utils/constants/nftTableHeaders';
import { NFTItemWrapper } from '@/components/pages/DropzonePage/NFTItemWrapper';
import { countInvalidObjects } from '@/utils/helpers/countInvalidMetadataObjects';
import { dictionary } from '@/libs/en';

const BATCH_SIZE = 10;

interface NFTListProps {
  metadata: MetadataObject[];
  validationResponse: ValidateArrayOfObjectsResult;
}

export const NFTList = ({ metadata, validationResponse }: NFTListProps) => {
  const [visibleItems, setVisibleItems] = useState(metadata.slice(0, BATCH_SIZE));
  const [hasMore, setHasMore] = useState(metadata.length > BATCH_SIZE);

  useEffect(() => {
    setVisibleItems(metadata.slice(0, BATCH_SIZE));
    setHasMore(metadata.length > BATCH_SIZE);
  }, [metadata]);

  const fetchMoreData = useCallback(() => {
    const nextItemsCount = Math.min(visibleItems.length + BATCH_SIZE, metadata.length);

    if (visibleItems.length >= metadata.length) {
      setHasMore(false);
      return;
    }

    setVisibleItems(metadata.slice(0, nextItemsCount));
  }, [visibleItems.length, metadata]);

  return (
    <InfiniteScroll dataLength={visibleItems.length} next={fetchMoreData} hasMore={hasMore} loader={<></>}>
      <h2 className="mb-10 pl-4 font-semibold">{`${dictionary.nftTable.invalidFilesCount}:  ${countInvalidObjects(validationResponse)}`}</h2>
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
          {visibleItems.map((item, index) => (
            <NFTItemWrapper key={index} item={item} index={index} metadata={metadata} validationResponse={validationResponse} />
          ))}
        </TableBody>
      </Table>
    </InfiniteScroll>
  );
};

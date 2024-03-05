/*-
 *
 * Hedera NFT Utilities
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
import type { ExtFile } from '@dropzone-ui/react';
import Papa from 'papaparse';
// TODO - local import only for temporary testing purposes
// eslint-disable-next-line no-restricted-imports
import { prepareMetadataObjectsFromCSVRows } from '../../../../hedera-nft-utilities/src/nftSDKFunctions/prepare-metadata-objects-from-csv-rows';
// TODO - local import only for temporary testing purposes
// eslint-disable-next-line no-restricted-imports
import type { MetadataObject } from '../../../../hedera-nft-utilities/src/types/csv';
import { dictionary } from '@/libs/en';
import type { CSVRow } from '@/utils/types/csv';
// import type { MetadataObject } from '@/utils/types/metadata';

type CurrentType = 'attributes' | 'properties' | null;

const ATTRIBUTES = 'attributes';
const PROPERTIES = 'properties';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CSVFileReader {
  private static processHeader(
    header: { header: string; index: number },
    currentType: CurrentType,
    propertyIndex: number,
    attributesIndex: number,
  ): {
    result: string | null;
    currentType: CurrentType;
    propertyIndex: number;
    attributesIndex: number;
  } {
    let result: string | null = null;
    if (header.header === ATTRIBUTES) {
      currentType = ATTRIBUTES;
      attributesIndex++;
    } else if (header.header === PROPERTIES) {
      currentType = PROPERTIES;
      propertyIndex = 1;
    } else if (!currentType) {
      return { result: header.header, currentType, propertyIndex, attributesIndex };
    }

    if (currentType === PROPERTIES) {
      result = `${PROPERTIES}_${propertyIndex}`;
      propertyIndex++;
    }

    if (currentType === ATTRIBUTES) {
      result = `${ATTRIBUTES}_${attributesIndex}`;
      attributesIndex++;
    }

    return { result, currentType, propertyIndex, attributesIndex };
  }

  static readCSVFromFile(extFile: ExtFile): Promise<CSVRow[]> {
    return new Promise((resolve, reject) => {
      if (!extFile.file) {
        reject(new Error('No file provided'));
        return;
      }

      let currentType: CurrentType = null;
      let propertyIndex = 0;
      let attributesIndex = 0;

      try {
        Papa.parse<CSVRow>(extFile.file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string, index: number): string => {
            if (index === 0) {
              currentType = null;
              propertyIndex = 0;
              attributesIndex = 0;
            }

            const headerObj = { header, index };
            const {
              result,
              currentType: updatedCurrentType,
              propertyIndex: updatedPropertyIndex,
              attributesIndex: updatedAttributesIndex,
            } = CSVFileReader.processHeader(headerObj, currentType, propertyIndex, attributesIndex);

            currentType = updatedCurrentType;
            propertyIndex = updatedPropertyIndex;
            attributesIndex = updatedAttributesIndex;

            return result ?? '';
          },

          complete: (result: Papa.ParseResult<CSVRow>) => {
            resolve(result.data);
          },
          error: (error) => {
            reject(new Error(error.message));
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : dictionary.errors.unknownError;
        reject(new Error(errorMessage));
      }
    });
  }

  static async convertCSVRowsToMetadataObjects(extFile: ExtFile) {
    try {
      const csvParsedRows: CSVRow[] = await CSVFileReader.readCSVFromFile(extFile);
      const metadataObjects: MetadataObject[] = prepareMetadataObjectsFromCSVRows({ csvParsedRows });
      return metadataObjects;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

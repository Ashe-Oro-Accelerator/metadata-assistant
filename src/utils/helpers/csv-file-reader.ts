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
import type { MetadataObject, CSVRow } from 'hedera-nft-utilities';
import { prepareMetadataObjectsFromCSVRows } from 'hedera-nft-utilities/src/file-management/prepare-metadata-objects-from-csv-rows';
import Papa from 'papaparse';
import { dictionary } from '@/libs/en';
import { formatErrorMessage } from '@/utils/helpers/formatErrorMessage';

type CurrentType = 'attributes' | 'properties' | null;

const ATTRIBUTES = 'attributes';
const PROPERTIES = 'properties';

const processHeader = (
  header: { header: string; index: number },
  currentType: CurrentType,
  propertyIndex: number,
  attributesIndex: number,
): {
  result: string | null;
  currentType: CurrentType;
  propertyIndex: number;
  attributesIndex: number;
} => {
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
};

export const readCSVFromFile = (extFile: ExtFile): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    if (!extFile.file) {
      reject(new Error(dictionary.errors.noFileProvided));
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
          } = processHeader(headerObj, currentType, propertyIndex, attributesIndex);

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
      reject(new Error(formatErrorMessage(error)));
    }
  });
};

export const convertCSVRowsToMetadataObjects = async (extFile: ExtFile) => {
  const csvParsedRows: CSVRow[] = await readCSVFromFile(extFile);
  const metadataObjects: MetadataObject[] = prepareMetadataObjectsFromCSVRows({ csvParsedRows });
  return metadataObjects;
};

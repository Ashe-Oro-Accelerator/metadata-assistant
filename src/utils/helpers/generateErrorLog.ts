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
import { MetadataRow } from '@/utils/types/metadataRow';
import type { ExtFile } from '@dropzone-ui/react';
import { ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';

export const generateErrorLog = (
  metadata: MetadataRow[],
  validationResponse: ValidateArrayOfObjectsResult | undefined,
  extFile: ExtFile,
): string | undefined => {
  if (!extFile || !extFile.file) return;
  let errorLog = '';
  const isCSV = extFile.file.type.includes('csv') || extFile.file.name.endsWith('.csv');

  if (validationResponse) {
    Object.entries(validationResponse.results).forEach(([index, result]) => {
      if (!result.isValid) {
        const formattedErrors = result.errors.map((error) => `- ${error}`).join('\n');
        const identifier = isCSV ? `Index: ${+index + 1}` : `File Name: ${metadata[+index]?.fileName || `-`}`;

        errorLog += `${identifier}\nErrors:\n${formattedErrors}\n\n`;
      }
    });
  }

  const blob = new Blob([errorLog], { type: 'text/plain' });
  const errorLogURL = URL.createObjectURL(blob);
  return errorLogURL;
};

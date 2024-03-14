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
import { dictionary } from '@/libs/en';
import type { MetadataRow } from '@/utils/types/metadataRow';
import type { ExtFile } from '@dropzone-ui/react';
import type { MetadataObject } from 'hedera-nft-utilities';

export const processJsonFile = (extFile: ExtFile): Promise<MetadataRow[]> => {
  return new Promise((resolve, reject) => {
    if (!extFile.file) {
      reject(new Error(dictionary.errors.noFileProvided));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        const text = event.target.result as string;
        try {
          const json = text ? (JSON.parse(text) as MetadataObject) : {};
          resolve([{ metadata: json, fileName: extFile.name! }]);
        } catch (err) {
          reject(new Error(dictionary.errors.parsingError(extFile.name, err instanceof Error ? err.message : '')));
        }
      } else {
        resolve([{ metadata: {}, fileName: extFile.name! }]);
      }
    };

    reader.onerror = (err) => {
      console.error(err);
      reject(new Error(dictionary.errors.jsonFileUpload));
    };

    reader.readAsText(extFile.file);
  });
};

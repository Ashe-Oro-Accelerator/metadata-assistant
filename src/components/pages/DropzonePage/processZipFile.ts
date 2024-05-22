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
import { dictionary } from '@/libs/en';
import { MetadataRow } from '@/utils/types/metadataRow';
import type { ExtFile } from '@dropzone-ui/react';
import { MetadataObject } from '@hashgraph/hedera-nft-sdk';
import JSZip from 'jszip';

export async function processZipFile(extFile: ExtFile): Promise<MetadataRow[]> {
  if (!extFile.file) throw new Error(dictionary.errors.noFileProvided);

  const zip = new JSZip();
  const content = await zip.loadAsync(extFile.file);
  const jsonFiles = Object.keys(content.files).filter((fileName) => fileName.endsWith('.json'));
  if (jsonFiles.length === 0) throw new Error(dictionary.errors.zipFileWithoutJsonFiles);

  const metadataRows: MetadataRow[] = [];
  for (const fullFileName of jsonFiles) {
    const file = content.file(fullFileName);
    if (file) {
      const fileData = (await file.async('string')).trim();
      const json = fileData ? (JSON.parse(fileData) as MetadataObject) : {};
      const fileName = fullFileName.split('/').pop() ?? '';
      metadataRows.push({ metadata: json, fileName });
    }
  }
  return metadataRows;
}

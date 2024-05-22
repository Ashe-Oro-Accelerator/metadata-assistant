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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { MetadataObject } from '@hashgraph/hedera-nft-sdk';

export const saveMetadataObjectsAsJsonFiles = (metadataObjects: MetadataObject[]) => {
  const zip = new JSZip();

  metadataObjects.forEach((obj, index) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    zip.file(`${index + 1}.json`, jsonStr);
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'metadata.zip');
  });
};

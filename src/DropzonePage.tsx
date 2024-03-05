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
import { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';
import type { ExtFile } from '@dropzone-ui/react';
// TODO - local import only for temporary testing purposes
// eslint-disable-next-line no-restricted-imports
import type { MetadataObject } from '../../hedera-nft-utilities/src/types/csv';
import { dictionary } from '@/libs/en';
import { CSVFileReader } from '@/utils/helpers/csv-file-reader';

export default function DropzonePage() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [metadata, setMetadata] = useState<MetadataObject[]>([]);
  console.log('files:', files);
  console.log('metadata:', metadata);

  const readFile = async (extFile: ExtFile) => {
    if (!extFile.file) return;
    if (extFile.file.type === 'application/json' || extFile.file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.readAsText(extFile.file);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          const text = event.target.result as string;
          try {
            const json = JSON.parse(text) as MetadataObject;
            setMetadata([json]);
          } catch (err) {
            console.error(dictionary.errors.parsingError(extFile.name, err as string));
            setMetadata([]);
          }
        }
      };
    } else if (extFile.file.type.includes('csv') || extFile.file.name.endsWith('.csv')) {
      const metadataObjects: MetadataObject[] = await CSVFileReader.convertCSVRowsToMetadataObjects(extFile);
      setMetadata(metadataObjects);
    }
  };

  const updateFilesReplace = (incommingFiles: ExtFile[]) => {
    setFiles(incommingFiles);
  };

  useEffect(() => {
    if (files.length > 0) {
      void readFile(files[0]);
    }
  }, [files]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.header.title}</h1>
      <p className="mb-10 text-center font-semibold leading-7 [&:not(:first-child)]:mt-6">{dictionary.header.description}</p>
      <div className="relative flex flex-col justify-center">
        <Dropzone
          onChange={updateFilesReplace}
          accept="application/json, text/csv"
          autoClean
          header={false}
          footer={false}
          label={dictionary.dropzone.description}
          behaviour="replace"
          max={1}
          style={{ fontFamily: 'Roboto' }}
        >
          {files.length > 0 && files.map((file) => <FileMosaic key={file.id} {...file} valid={undefined} style={{ fontFamily: 'Roboto' }} />)}
        </Dropzone>
      </div>
    </div>
  );
}

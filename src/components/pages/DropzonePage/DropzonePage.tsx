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
import JSZip from 'jszip';
// TODO - local import only for temporary testing purposes
// eslint-disable-next-line no-restricted-imports
import type { MetadataObject } from '../../../../../hedera-nft-utilities/src/types/csv';
import { supportedFileTypes } from '@/components/pages/DropzonePage/supportedFileTypes';
import { dictionary } from '@/libs/en';
import { CSVFileReader } from '@/utils/helpers/csv-file-reader';
import { formatErrorMessage } from '@/utils/helpers/formatErrorMessage';

export default function DropzonePage() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [metadata, setMetadata] = useState<MetadataObject[]>([]);
  const [error, setError] = useState<string>('');
  console.log('error:', error);
  console.log('files:', files);
  console.log('metadata:', metadata);

  const readFile = async (extFile: ExtFile) => {
    setMetadata([]);
    setError('');
    if (!extFile.file) return;
    if (extFile.file.type === 'application/zip' || extFile.file.name.endsWith('.zip')) {
      const zip = new JSZip();
      const content = await zip.loadAsync(extFile.file);
      const jsonFiles = Object.keys(content.files).filter((fileName) => fileName.endsWith('.json'));
      for (const fileName of jsonFiles) {
        const file = content.file(fileName);
        if (file) {
          const fileData = await file.async('string');
          try {
            const json = JSON.parse(fileData) as MetadataObject;
            setMetadata((prevMetadata) => [...prevMetadata, json]);
          } catch (err) {
            console.error(dictionary.errors.parsingError(fileName, err as string));
            setMetadata([]);
            setError(formatErrorMessage(err));
          }
        }
      }
    } else if (extFile.file.type === 'application/json' || extFile.file.name.endsWith('.json')) {
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
            setError(formatErrorMessage(err));
          }
        }
      };
    } else if (extFile.file.type.includes('csv') || extFile.file.name.endsWith('.csv')) {
      try {
        const metadataObjects: MetadataObject[] = await CSVFileReader.convertCSVRowsToMetadataObjects(extFile);
        setMetadata(metadataObjects);
      } catch (err) {
        console.error(err);
        setError(formatErrorMessage(err));
      }
    } else {
      setError(dictionary.errors.unsupportedFileType);
      return;
    }
  };

  const updateFilesReplace = (incomingFiles: ExtFile[]) => {
    setFiles(incomingFiles);
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
          accept={supportedFileTypes()}
          header={false}
          footer={false}
          label={dictionary.dropzone.description}
          behaviour="replace"
          max={1}
          className="dropzone-label"
        >
          {files.length > 0 && files.map((file) => <FileMosaic key={file.id} {...file} valid={undefined} className="dropzone-label" />)}
        </Dropzone>
        {error && <span className="mt-2 text-center font-bold text-red-500">{error}</span>}
      </div>
    </div>
  );
}

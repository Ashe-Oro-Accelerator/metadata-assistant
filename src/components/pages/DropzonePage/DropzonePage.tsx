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
import { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';
import type { ExtFile } from '@dropzone-ui/react';
import type { ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';
import { Hip412Validator } from 'hedera-nft-utilities/src/hip412-validator';
import { SUPPORTED_FILE_TYPES_ARRAY, supportedFileTypes } from '@/components/pages/DropzonePage/supportedFileTypes';
import { dictionary } from '@/libs/en';
import { NFTList } from '@/components/pages/DropzonePage/NFTList';
import { Button } from '@/components/ui/button';
import { saveMetadataObjectsAsJsonFiles } from '@/utils/helpers/saveMetadataObjectsAsJsonFiles';
import { generateErrorLog } from '@/utils/helpers/generateErrorLog';
import { MetadataRow } from '@/utils/types/metadataRow';
import { processZipFile } from '@/components/pages/DropzonePage/processZipFile';
import { processJsonFile } from '@/components/pages/DropzonePage/processJsonFile';
import { processCsvFile } from '@/components/pages/DropzonePage/processCSVFile';

export default function DropzonePage() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [metadata, setMetadata] = useState<MetadataRow[]>([]);
  const [error, setError] = useState<string>('');
  const [validationResponse, setValidationResponse] = useState<ValidateArrayOfObjectsResult | undefined>(undefined);
  const isCSVFile = files[0]?.type?.includes('csv') || files[0]?.name?.endsWith('.csv');
  const metadataObjects = metadata.map((m) => m.metadata);
  // This sorting is used because ZIP files don't keep files in order, so it makes sure everything is listed alphabetically
  const sortedMetadataRows = metadata.sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: 'base' }));
  const errorLogURL = generateErrorLog(metadata, validationResponse, files[0]);

  const readFile = async (extFile: ExtFile) => {
    setMetadata([]);
    setError('');

    if (!extFile.file) return;
    if (extFile.file.type === 'application/zip' || extFile.file.name.endsWith('.zip')) {
      try {
        const newMetadata = await processZipFile(extFile);
        setMetadata(newMetadata);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    } else if (extFile.file.type === 'application/json' || extFile.file.name.endsWith('.json')) {
      processJsonFile(extFile)
        .then((newMetadata) => setMetadata(newMetadata))
        .catch((error) => setError(error.message));
    } else if (extFile.file.type.includes('csv') || extFile.file.name.endsWith('.csv')) {
      processCsvFile(extFile)
        .then((newMetadata) => setMetadata(newMetadata))
        .catch((error) => setError(error.message));
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

  useEffect(() => {
    if (metadata.length > 0) {
      const validationResponse: ValidateArrayOfObjectsResult = Hip412Validator.validateArrayOfObjects(metadataObjects);
      setValidationResponse(validationResponse);
    }
  }, [metadata]);

  return (
    <div className="container mx-auto">
      <div className="relative mx-auto flex max-w-[600px] flex-col items-center justify-center">
        <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.header.title}</h1>
        <p className="text-center leading-7 [&:not(:first-child)]:mt-6">{dictionary.header.description}</p>
        <p className="mb-10 text-center leading-7 [&:not(:first-child)]:mt-6">{dictionary.header.prompt}</p>
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
          {files.length > 0 &&
            files.map((file) => (
              <FileMosaic
                key={file.id}
                {...file}
                valid={SUPPORTED_FILE_TYPES_ARRAY.some((type) => file.file?.name.endsWith(type)) ? undefined : false}
                className="dropzone-label"
              />
            ))}
        </Dropzone>
        {error && <span className="mt-2 text-center font-bold text-red-500">{error}</span>}
      </div>
      {validationResponse && metadata.length > 0 && (
        <div className="my-10">
          <div className="mb-10 flex items-center justify-between px-4">
            <div>
              <h3 className="font-semibold text-2xl">{dictionary.nftTable.title}</h3>
            </div>
            <div className="flex gap-4">
              {validationResponse && !validationResponse.allObjectsValid && (
                <a href={errorLogURL} download="error_log.txt" className="button-class">
                  <Button>{dictionary.nftTable.downloadErrorLogButton}</Button>
                </a>
              )}
              {isCSVFile && (
                <Button onClick={() => saveMetadataObjectsAsJsonFiles(metadataObjects)}>{dictionary.nftTable.downloadJSONsButton}</Button>
              )}
            </div>
          </div>
          <NFTList metadataRows={sortedMetadataRows} validationResponse={validationResponse} />
        </div>
      )}
    </div>
  );
}

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
import { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';
import type { ExtFile } from '@dropzone-ui/react';
import type { MetadataObject, ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';
import { Hip412Validator } from 'hedera-nft-utilities/src/hip412-validator';
import JSZip from 'jszip';
import { SUPPORTED_FILE_TYPES_ARRAY, supportedFileTypes } from '@/components/pages/DropzonePage/supportedFileTypes';
import { dictionary } from '@/libs/en';
import { convertCSVRowsToMetadataObjects } from '@/utils/helpers/csv-file-reader';
import { formatErrorMessage } from '@/utils/helpers/formatErrorMessage';
import { NFTList } from '@/components/pages/DropzonePage/NFTList';
import { Button } from '@/components/ui/button';
import { saveMetadataObjectsAsJsonFiles } from '@/utils/helpers/saveMetadataObjectsAsJsonFiles';
import { generateErrorLog } from '@/utils/helpers/generateErrorLog';

export default function DropzonePage() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [metadata, setMetadata] = useState<MetadataObject[]>([]);
  const [error, setError] = useState<string>('');
  const [validationResponse, setValidationResponse] = useState<ValidateArrayOfObjectsResult | undefined>(undefined);
  const isCSVFile = files[0]?.type?.includes('csv') || files[0]?.name?.endsWith('.csv');
  const errorLogURL = generateErrorLog(metadata, validationResponse);

  const readFile = async (extFile: ExtFile) => {
    setMetadata([]);
    setError('');

    if (!extFile.file) return;
    if (extFile.file.type === 'application/zip' || extFile.file.name.endsWith('.zip')) {
      const zip = new JSZip();
      const content = await zip.loadAsync(extFile.file);
      const jsonFiles = Object.keys(content.files).filter((fileName) => fileName.endsWith('.json'));

      if (jsonFiles.length === 0) {
        setError(dictionary.errors.zipFileWithoutJsonFiles);
        return;
      }

      for (const fileName of jsonFiles) {
        const file = content.file(fileName);
        if (file) {
          const fileData = (await file.async('string')).trim();

          try {
            const json = fileData ? (JSON.parse(fileData) as MetadataObject) : {};
            setMetadata((prevMetadata) => [...prevMetadata, json]);
          } catch (err) {
            console.error(dictionary.errors.parsingError(fileName, err as string));
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
            const json = text ? (JSON.parse(text) as MetadataObject) : {};
            setMetadata([json]);
          } catch (err) {
            console.error(dictionary.errors.parsingError(extFile.name, err as string));
            setError(formatErrorMessage(err));
          }
        } else {
          setMetadata([{}]);
        }
      };
    } else if (extFile.file.type.includes('csv') || extFile.file.name.endsWith('.csv')) {
      try {
        const metadataObjects: MetadataObject[] = await convertCSVRowsToMetadataObjects(extFile);
        setMetadata(metadataObjects.length ? metadataObjects : [{}]);
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

  useEffect(() => {
    if (metadata.length > 0) {
      const validationResponse: ValidateArrayOfObjectsResult = Hip412Validator.validateArrayOfObjects(metadata);
      setValidationResponse(validationResponse);
    }
  }, [metadata]);

  return (
    <div className="container mx-auto">
      <div className="relative mx-auto flex max-w-[600px] flex-col items-center justify-center">
        <h1 className="mt-6 scroll-m-20 text-center font-geistVariable text-3xl font-bold tracking-tight lg:text-6xl">{dictionary.header.title}</h1>
        <p className="mb-10 text-center text-xl font-medium leading-7 [&:not(:first-child)]:mt-6">{dictionary.header.description}</p>
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
              <h3 className="font-semibold">{dictionary.nftTable.title}</h3>
              <p>{dictionary.nftTable.description}</p>
            </div>
            <div className="flex gap-4">
              {validationResponse && !validationResponse.allObjectsValid && (
                <a href={errorLogURL} download="error_log.txt" className="button-class">
                  <Button>{dictionary.nftTable.downloadErrorLogButton}</Button>
                </a>
              )}
              {isCSVFile && <Button onClick={() => saveMetadataObjectsAsJsonFiles(metadata)}>{dictionary.nftTable.downloadJSONsButton}</Button>}
            </div>
          </div>

          <NFTList metadata={metadata} validationResponse={validationResponse} />
        </div>
      )}
    </div>
  );
}

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
import type { ExtFile } from '@dropzone-ui/react';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';
import { dictionary } from '@/libs/en';
import type { MetadataObject } from '@/utils/types/metadata';

const App = () => {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [jsonData, setJsonData] = useState<MetadataObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  console.log('files:', files);
  console.log('jsonData:', jsonData);
  console.log('error:', error);

  const handleFilesChange = (incomingFiles: ExtFile[]) => {
    incomingFiles.forEach((extFile) => {
      if (extFile.file) {
        const reader = new FileReader();
        reader.readAsText(extFile.file);
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result) {
            const text = event.target.result as string;
            try {
              const json = JSON.parse(text) as MetadataObject;
              if (!jsonData.some((data) => JSON.stringify(data) === JSON.stringify(json))) {
                setJsonData((prev) => [...prev, json]);
              } else {
                setError(dictionary.errors.duplicateFile(extFile.name));
              }
            } catch (err) {
              setError(dictionary.errors.parsingError(extFile.name, err as string));
            }
          }
        };
      }
    });
  };

  const updateFiles = (incomingFiles: ExtFile[]) => {
    const newFiles = incomingFiles.filter((incomingFile) => !files.some((existingFile) => existingFile.name === incomingFile.name));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFiles = () => {
    setFiles([]);
    setJsonData([]);
    setError(null);
  };

  useEffect(() => {
    handleFilesChange(files);
  }, [files]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.header.title}</h1>
      <p className="mb-10 text-center font-semibold leading-7 [&:not(:first-child)]:mt-6">{dictionary.header.description}</p>
      <div className="relative flex flex-col justify-center">
        <Dropzone
          onChange={updateFiles}
          value={files}
          accept="application/json"
          autoClean
          header={false}
          label={dictionary.dropzone.description}
          actionButtons={{
            position: 'before',
            deleteButton: {
              label: 'Remove files',
              onClick: () => {
                removeFiles();
              },
            },
          }}
        >
          {files.map((file: ExtFile) => (
            <FileMosaic key={file.id} {...file} valid={undefined} />
          ))}
        </Dropzone>
      </div>
    </div>
  );
};

export default App;

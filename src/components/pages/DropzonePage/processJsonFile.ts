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

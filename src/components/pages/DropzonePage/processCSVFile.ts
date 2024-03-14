import type { ExtFile } from '@dropzone-ui/react';
import type { MetadataObject } from 'hedera-nft-utilities';
import type { MetadataRow } from '@/utils/types/metadataRow';
import { convertCSVRowsToMetadataObjects } from '@/utils/helpers/csv-file-reader';
import { dictionary } from '@/libs/en';

export const processCsvFile = async (extFile: ExtFile): Promise<MetadataRow[]> => {
  if (!extFile.file) {
    throw new Error(dictionary.errors.noFileProvided);
  }

  try {
    const metadataObjects: MetadataObject[] = await convertCSVRowsToMetadataObjects(extFile);
    return metadataObjects.map((metadata) => ({
      metadata,
      fileName: extFile.name!,
    }));
  } catch (err) {
    throw new Error(dictionary.errors.csvFileUpload);
  }
};

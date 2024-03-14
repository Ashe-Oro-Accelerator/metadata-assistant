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
    const metadataRows: MetadataRow[] = metadataObjects.map((metadata) => ({ metadata, fileName: extFile.name! }));
    const metadata = metadataRows.length ? metadataRows : [{ metadata: {}, fileName: extFile.name! }];
    return metadata;
  } catch (err) {
    throw new Error(dictionary.errors.csvFileUpload);
  }
};

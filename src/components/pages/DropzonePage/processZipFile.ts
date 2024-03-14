import { dictionary } from '@/libs/en';
import { MetadataRow } from '@/utils/types/metadataRow';
import type { ExtFile } from '@dropzone-ui/react';
import { MetadataObject } from 'hedera-nft-utilities';
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

import { MetadataObject, ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';

export const generateErrorLog = (metadata: MetadataObject[], validationResponse: ValidateArrayOfObjectsResult | undefined): string => {
  let errorLog = '';

  if (validationResponse) {
    Object.entries(validationResponse.results).forEach(([index, result]) => {
      if (!result.isValid) {
        const formattedErrors = result.errors.map((error) => `- ${error}`).join('\n');
        const metadataName = metadata[+index]?.name || `-`;
        errorLog += `Index: ${+index + 1}\nName: ${metadataName}\nErrors:\n${formattedErrors}\n\n`;
      }
    });
  }

  const blob = new Blob([errorLog], { type: 'text/plain' });
  const errorLogURL = URL.createObjectURL(blob);

  return errorLogURL;
};

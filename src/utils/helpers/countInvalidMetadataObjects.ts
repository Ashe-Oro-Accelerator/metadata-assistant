import { ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';

export const countInvalidObjects = (validationResponse: ValidateArrayOfObjectsResult): number => {
  return Object.values(validationResponse.results).reduce((acc, current) => {
    if (current.errorsCount > 0) {
      acc += 1;
    }
    return acc;
  }, 0);
};

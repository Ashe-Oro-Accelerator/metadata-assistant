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
import { ValidateArrayOfObjectsResult } from 'hedera-nft-utilities';

export const countInvalidObjects = (validationResponse: ValidateArrayOfObjectsResult): number => {
  return Object.values(validationResponse.results).reduce((acc, current) => {
    if (current.errorsCount > 0) {
      acc += 1;
    }
    return acc;
  }, 0);
};

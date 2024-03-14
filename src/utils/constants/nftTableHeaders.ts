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
import { dictionary } from '@/libs/en';

export const TABLE_HEADERS = [
  dictionary.nftTable.headers.image,
  dictionary.nftTable.headers.name,
  dictionary.nftTable.headers.description,
  dictionary.nftTable.headers.validationStatus,
  dictionary.nftTable.headers.errors,
  // Last header as empty string to keep the hover effect on full width of the headers row
  '',
] as const;

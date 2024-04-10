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
export const dictionary = {
  header: {
    title: 'Metadata Validator',
    description: 'Validate all of the NFT Collection metadata to ensure it will be displayed correctly in wallets, marketplaces and explorers.',
    prompt: 'Upload a CSV file, individual JSON, or a ZIP containing JSON files.',
    downloadExamples: 'Download examples',
  },
  dropzone: { description: 'Upload a file' },
  nftTable: {
    title: 'Validation result',
    downloadJSONsButton: 'Download converted JSONs',
    downloadErrorLogButton: 'Download error log',
    detailsButton: 'Details',
    imageAltText: 'Image of',
    invalidFilesCount: 'Invalid files',
    headers: {
      number: '#',
      image: 'Image',
      name: 'Name',
      description: 'Description',
      validationStatus: 'Validation status',
      errors: 'Errors',
    },
  },
  errors: {
    unknownError: 'Unknown error occurred',
    jsonFileUpload: 'Error during processing the JSON file',
    csvFileUpload: 'Error during processing the CSV file',
    emptyJsonFiles: (emptyFiles: string[]) => `Empty JSON ${emptyFiles.length > 1 ? 'files' : 'file'} detected and skipped: ${emptyFiles.join(', ')}`,
    jsonFileEmpty: 'This json file is empty',
    duplicateFile: (fileName?: string) => `Duplicate file detected: ${fileName}`,
    parsingError: (fileName: string | undefined, err: string) => `Error parsing JSON from file ${fileName}: ${err}`,
    unsupportedFileType: 'This file type is unsupported',
    noFileProvided: 'No file provided',
    zipFileWithoutJsonFiles: 'This zip file does not contain json files.',
  },
  modal: {
    details: 'Details',
    modalTitle: 'NFT Preview',
    modalDescription: 'Preview how NFT will be displayed on a marketplace that follows HIP-412 standards.',
    modalImageAlt: 'NFT Image',
    descriptionTitle: 'Description',
    attributesTitle: 'Attributes',
    thereAreErrors: 'There are errors',
    nextButton: 'Next',
    previousButton: 'Previous',
    fileName: 'File name',
  },
} as const;

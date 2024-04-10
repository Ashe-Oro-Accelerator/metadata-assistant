# Metadata Validator

This application serves as a tool to assist with NFT metadata validation and conversion, offering a dropzone for uploading files in three formats:

- A `.json` file containing a single object representing NFT metadata.
- A `.csv` file that can include one or multiple metadata entries, which will be converted into objects (the first two lines are treated as headers for generating correct metadata object keys and are skipped in the conversion process).
- A `.zip` file that can contain one or several `.json` files.

## Usage

To run this project:

```
npm install
npm run dev
```

## Technologies

Developed with React and TypeScript, utilizing UI components from shadcn (https://ui.shadcn.com/), this project doesn't require any `.env` variable configurations.

## Features

The application displays data in a table format, providing information about your NFTs such as:

1. Index
2. Name
3. Description
4. Validation status (compatibility with the HIP-412 standard - passed or failed)
5. Errors - if there are any compatibility issues with HIP-412, this field shows the number of errors

Each entry features a "details" button, which opens a modal where users can learn more about any validation errors related to HIP-412, and view the NFT details with image (using an IPFS gateway).

### Additional Features

- When errors are present, a "Download error log" button appears, allowing users to download a file containing error log, which can be opened in a text editor.
- Uploading a `.csv` file activates the "Download JSONs" button. After converting the metadata from the `.csv` file, this button allows users to download the data as `.json` files, packed in a `metadata.zip` file. The `.json` files are named sequentially (1.json, 2.json, etc.).

## Contributing

How to contribute to this project:

- Create a fork of this repo on GitHub.
- Clone that forked copy using GitHub.
- Make your changes on a new branch.
- Submit a PR against the main branch of this copy of the git repo.

## Links

- API Reference: REST API [Link](https://docs.hedera.com/hedera/sdks-and-apis/rest-api)
- Swagger UI: Hedera Mirror Node REST API [Link](https://testnet.mirrornode.hedera.com/api/v1/docs/)

## Licence

MIT

export const SUPPORTED_FILE_TYPES_ARRAY = ['.zip', '.json', '.csv'];

export const supportedFileTypes = () => {
  return SUPPORTED_FILE_TYPES_ARRAY.join(', ');
};

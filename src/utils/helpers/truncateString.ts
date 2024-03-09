export const truncateString = (str: string, num: number) => {
  if (!str) return;
  if (str.length > num) {
    return str.slice(0, num).trim() + '...';
  } else {
    return str.trim();
  }
};

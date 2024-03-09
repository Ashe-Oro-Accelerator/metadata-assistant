export const truncateString = (str: string, num: number) => {
  console.log('str:', str);
  if (!str) return;
  if (str.length > num) {
    return str.slice(0, num).trim() + '...';
  } else {
    return str.trim();
  }
};

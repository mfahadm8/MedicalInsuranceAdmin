export const useUniqueOptions = <T, K extends keyof T>(data: T[], key: K) => {
  const uniqueValues = Array.from(new Set(data?.map((item) => item[key])));

  return uniqueValues?.map((value) => ({
    value: value as string,
    label: value as string,
  }));
};

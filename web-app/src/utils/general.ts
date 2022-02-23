import murmurhash from "murmurhash-js";

export const hash = (s: string) => {
  return murmurhash(s, 0);
};

export const copyToClipboard = (s: string): Promise<void> => {
  // TODO native support
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(s);
  }
  return Promise.reject("Browser does not support clipboard");
};

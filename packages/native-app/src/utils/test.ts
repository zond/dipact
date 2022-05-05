export const given = (label: string, callback: () => void) =>
  describe(`[Given] ${label}`, callback);

export const when = (label: string, callback: () => void) =>
  describe(`[When] ${label}`, callback);

export const then = (label: string, callback: () => void) =>
  test(`[Then] ${label}`, callback);

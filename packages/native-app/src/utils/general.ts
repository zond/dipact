import { Phase, TransformedGame, Variant } from "@diplicity/common";

export const assertDefined = <T extends object>(
  obj: T
): { [P in keyof T]: NonNullable<T[P]> } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ?? (null as any)])
  ) as any;
};

export const findDefined = <T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => boolean
): T => {
  const result = array.find(callback);

  if (result === undefined) {
    throw new Error("No matching element was found in the array");
  }
  return result;
};

export const findVariantByGame = (
  game: TransformedGame,
  variants: Variant[]
) => {
  return findDefined(variants, (variant) => variant.Name === game.variant);
};

export const findPhase = (phases: Phase[], id: number | null) => {
  if (id === null) {
    return phases.reduce((prev, current) =>
      prev.PhaseOrdinal > current.PhaseOrdinal ? prev : current
    );
  }
  return findDefined(phases, (phase) => phase.PhaseOrdinal === id);
};

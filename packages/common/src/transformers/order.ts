import {
  Order,
  OrderDisplay,
  Phase,
  ResolutionDisplay,
  Variant,
} from "../store/types";
import { translateKeys as tk } from "../translations";

export function provName(variant: Variant, prov: string) {
  if (variant.ProvinceLongNames && variant.ProvinceLongNames[prov]) {
    return variant.ProvinceLongNames[prov];
  }
  return prov;
}

// TODO test
export function humanizeOrder(variant: Variant, order: Order) {
  const parts = order.Parts;
  const types = parts.map((part) => {
    switch (part) {
      case "Support":
      case "Convoy":
      case "Disband":
      case "Hold":
      case "Build":
      case "Move":
        return "OrderType";
      default:
        break;
    }
    return "Province";
  });
  const words: string[] = [];
  parts.forEach((part, idx) => {
    if (idx + 1 > parts.length || part !== parts[idx + 1]) {
      if (types[idx] === "Province") {
        words.push(provName(variant, part));
      } else {
        words.push(part.toLowerCase());
      }
      if (
        (idx + 1 < types.length &&
          types[idx] === "Province" &&
          types[idx + 1] === "Province") ||
        (types[idx] === "OrderType" && parts[idx] === "Move")
      ) {
        words.push("to");
      }
    }
    if (
      idx > 1 &&
      types[idx - 2] === "OrderType" &&
      parts[idx - 2] === "Support" &&
      types[idx - 1] === "Province" &&
      types[idx] === "Province" &&
      parts[idx - 1] === parts[idx]
    ) {
      words.push("hold");
    }
  });
  return words.join(" ");
}

const getResolutionDisplay = (
  resolutionCode: string,
  variant: Variant
): ResolutionDisplay => {
  if (resolutionCode === "OK") {
    return {
      message: tk.orders.resolution.success,
    };
  }
  if (resolutionCode.includes("ErrBounce")) {
    const provinceCode = resolutionCode.split(":")[1];
    const province = provName(variant, provinceCode);
    return {
      message: tk.orders.resolution.bounced,
      province,
    };
  }
  if (resolutionCode.includes("ErrSupportBroken")) {
    const provinceCode = resolutionCode.split(":")[1];
    const province = provName(variant, provinceCode);
    return {
      message: tk.orders.resolution.supportBroken,
      province,
    };
  }
  throw Error(`Could not get ResolutionDisplay for resolutionCode: ${resolutionCode}`)
};

// TODO test
export const getOrderDisplay = (
  order: Order,
  variant: Variant,
  inconsistencies: string[],
  phase: Phase | undefined
): OrderDisplay => {
  const source = order.Parts[0];
  const resolutionCode =
    phase?.Resolutions?.find((resolution) => resolution.Province === source)
      ?.Resolution || null;

  const resolution = resolutionCode
    ? getResolutionDisplay(resolutionCode, variant)
    : null;
  const label = humanizeOrder(variant, order);
  return { label, resolution, inconsistencies };
};

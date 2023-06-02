/* eslint-disable no-restricted-globals */
import {
  ApiResponse,
  Channel,
  Message,
  // FCMToken,
  // Messaging,
  Variant,
} from "./types";

export const overrideReg = /[^\w]/g;
const colorReg = /^#([0-9a-fA-F]{3,3}|[0-9a-fA-F]{6,6}|[0-9a-fA-F]{8,8})$/;

type ParsedUserConfigColor = {
  type: string;
  variantCode?: string;
  nationCode?: string;
  value: string;
};

export const parseUserConfigColor = (
  userConfigColor: string
): ParsedUserConfigColor => {
  const parts = userConfigColor.split("/");
  if (parts.length === 1 && colorReg.exec(parts[0])) {
    return {
      type: "position",
      value: parts[0],
    };
  } else if (parts.length === 2 && colorReg.exec(parts[1])) {
    return {
      type: "nation",
      nationCode: parts[0],
      value: parts[1],
    };
  } else {
    return {
      type: "variant",
      variantCode: parts[0],
      nationCode: parts[1],
      value: parts[2],
    };
  }
};

export const createNationAbbreviation = (
  nation: string,
  otherNations: string[]
): string => {
  // TODO we could improve this by taking multi-word names and abbreviating
  // them by first letter of each word East Frankish Kingdom -> EFK
  // TODO abbreviations shouldn't include whitespace, see utils.tests.ts for example
  let abbreviation = "";
  for (let idx = 0; idx < nation.length; idx++) {
    const matchingNations = otherNations.filter((otherNation) => {
      return otherNation.indexOf(nation.slice(0, idx + 1)) === 0;
    }).length;
    if (matchingNations === 1) {
      abbreviation = nation.slice(0, idx + 1);
      break;
    }
  }
  return abbreviation;
};

// Order the variants so that Classical is first and the rest are alphabetical.
export const sortVariantResponse = (
  variants: ApiResponse<Variant>[]
): ApiResponse<Variant>[] => {
  const variantsForSort = [...variants];
  return variantsForSort.sort((variantA, variantB) => {
    if (variantA.Properties.Name === "Classical") return -1;
    if (variantB.Properties.Name === "Classical") return 1;
    return variantA.Properties.Name > variantB.Properties.Name ? 1 : -1;
  });
};

// TODO test
// Order the by latest message created date.
export const sortListChannels = (channels: Channel[]): Channel[] => {
  return [...channels].sort((channelA, channelB) => {
    if (channelA.LatestMessage) {
      const d1 = Date.parse(channelA.LatestMessage.CreatedAt);
      const d2 = Date.parse(channelB.LatestMessage.CreatedAt);
      return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
    }
    return 0;
  });
};

export const sortMessages = (messages: Message[]): Message[] => {
  return [...messages].sort((messageA, messageB) => {
    if (messageA.CreatedAt) {
      const d1 = Date.parse(messageA.CreatedAt);
      const d2 = Date.parse(messageB.CreatedAt);
      return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
    }
    return 0;
  });
};

export const addNationAbbreviationsToVariant = (variant: Variant): Variant => {
  const nationAbbreviations: { [key: string]: string } = {};
  variant.Nations.forEach((nation) => {
    nationAbbreviations[nation] = createNationAbbreviation(
      nation,
      variant.Nations
    );
  });
  return { ...variant, nationAbbreviations };
};

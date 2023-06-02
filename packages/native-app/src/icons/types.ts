import { IconType } from "@rneui/base";

import { IconNames } from "diplicity-common-internal";

export type IconMap = {
  [key in IconNames]: { name: string; type: IconType };
};

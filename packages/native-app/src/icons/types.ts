import { IconType } from "@rneui/base";

import { IconNames } from "../../common";

export type IconMap = {
  [key in IconNames]: { name: string; type: IconType };
};

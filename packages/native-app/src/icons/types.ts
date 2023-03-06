import { IconNames } from "@diplicity/common";
import { IconType } from "@rneui/base";

export type IconMap = {
  [key in IconNames]: { name: string; type: IconType };
};

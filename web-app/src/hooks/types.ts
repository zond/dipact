import { Channel as StoreChannel, Message as StoreMessage, Phase } from "../store/types";

export type Message = StoreMessage & {
  phase: Phase;
  undelivered: boolean;
  color: string;
  variant: string;
  selfish: boolean;
  nationAbbreviation: string;
  link: string | undefined;
};

export interface Channel extends StoreChannel {
  title: string;
  nations: {
    name: string;
    abbreviation: string;
    color: string;
    link: string | undefined;
  }[];
  member?: {
    Nation: string;
  };
  id: string;
}

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component, { Nation } from "../components/Orders/NationSummary";
import { NationStatus } from "../hooks/useOrders";

export default {
  title: "components/Orders/NationSummary",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "500px" }}>
    <Component {...args} />
  </div>
);

type Args = React.ComponentProps<typeof Component>;

const Nations: { [key: string]: Nation } = {
  France: {
    abbreviation: "fr",
    name: "France",
    color: "#FFF",
    flagLink:
      "https://diplicity-engine.appspot.com/Variant/Classical/Flags/France.svg",
    isUser: false,
  },
};

const defaultNationStatus: NationStatus = {
  numBuilds: 0,
  numDisbands: 0,
  numSupplyCenters: 3,
  numSupplyCentersToWin: 15,
  nation: Nations.France,
  confirmedOrders: false,
  wantsDraw: false,
  noOrdersGiven: false,
  orders: [],
  homelessInconsistencies: [],
};

const defaultArgs: Args = {
  nationStatus: { ...defaultNationStatus },
};

export const SupplyCentersPlural = Template.bind({});
SupplyCentersPlural.args = {
  nationStatus: {
    ...defaultNationStatus,
  },
};

export const SupplyCentersSingular = Template.bind({});
SupplyCentersSingular.args = {
  nationStatus: {
    ...defaultNationStatus,
    numSupplyCenters: 1,
  },
};

export const SupplyCentersZero = Template.bind({});
SupplyCentersZero.args = {
  nationStatus: {
    ...defaultNationStatus,
    numSupplyCenters: 0,
  },
};

export const ConfirmedOrders = Template.bind({});
ConfirmedOrders.args = {
  nationStatus: {
    ...defaultNationStatus,
    confirmedOrders: true,
  },
};

export const WantsDraw = Template.bind({});
WantsDraw.args = {
  nationStatus: {
    ...defaultNationStatus,
    wantsDraw: true,
  },
};

export const NoOrdersGiven = Template.bind({});
NoOrdersGiven.args = {
  nationStatus: {
    ...defaultNationStatus,
    noOrdersGiven: true,
  },
};

export const ConfirmedOrdersAndWantsDraw = Template.bind({});
ConfirmedOrdersAndWantsDraw.args = {
  nationStatus: {
    ...defaultNationStatus,
    confirmedOrders: true,
    wantsDraw: true,
  },
};

export const WantsDrawAndNoOrdersGiven = Template.bind({});
WantsDrawAndNoOrdersGiven.args = {
  nationStatus: {
    ...defaultNationStatus,
    noOrdersGiven: true,
    wantsDraw: true,
  },
};

export const IsUser = Template.bind({});
IsUser.args = {
  nationStatus: {
    ...defaultNationStatus,
    nation: {
      ...Nations.France,
      isUser: true,
    },
  },
};

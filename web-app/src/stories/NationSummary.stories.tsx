import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component, { Nation } from "../components/Orders/NationSummary";

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

const defaultArgs: Args = {
  numBuilds: 0,
  numDisbands: 0,
  numSupplyCenters: 3,
  numSupplyCentersToWin: 15,
  nation: Nations.France,
  confirmedOrders: false,
  wantsDraw: false,
  noOrdersGiven: false,
};

export const SupplyCentersPlural = Template.bind({});
SupplyCentersPlural.args = {
  ...defaultArgs,
};

export const SupplyCentersSingular = Template.bind({});
SupplyCentersSingular.args = {
  ...defaultArgs,
  numSupplyCenters: 1,
};

export const SupplyCentersZero = Template.bind({});
SupplyCentersZero.args = {
  ...defaultArgs,
  numSupplyCenters: 0,
};

export const ConfirmedOrders = Template.bind({});
ConfirmedOrders.args = {
  ...defaultArgs,
  confirmedOrders: true,
};

export const WantsDraw = Template.bind({});
WantsDraw.args = {
  ...defaultArgs,
  wantsDraw: true,
};

export const NoOrdersGiven = Template.bind({});
NoOrdersGiven.args = {
  ...defaultArgs,
  noOrdersGiven: true,
};

export const ConfirmedOrdersAndWantsDraw = Template.bind({});
ConfirmedOrdersAndWantsDraw.args = {
  ...defaultArgs,
  confirmedOrders: true,
  wantsDraw: true,
};

export const WantsDrawAndNoOrdersGiven = Template.bind({});
WantsDrawAndNoOrdersGiven.args = {
  ...defaultArgs,
  noOrdersGiven: true,
  wantsDraw: true,
};

export const IsUser = Template.bind({});
IsUser.args = {
  ...defaultArgs,
  nation: {
    ...Nations.France,
    isUser: true,
  }
};

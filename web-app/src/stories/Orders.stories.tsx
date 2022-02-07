import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../pages/Orders";
import {
  ordersDecorator,
  phaseSelectorDecorator,
  routerDecorator,
} from "./decorators";
import {
  defaultCombinedQuerystate,
  defaultUsePhaseSelectorArgs,
  Nations,
} from "./base";
import { NationStatus } from "../hooks/useOrders";
import { Container } from "@mui/material";

export default {
  title: "pages/Orders",
  component: Component,
  decorators: [
    phaseSelectorDecorator({ ...defaultUsePhaseSelectorArgs }),
    routerDecorator(),
  ],
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Container>
    <Component />
  </Container>
);
const defaultUseOrdersArgs = {
  combinedQueryState: defaultCombinedQuerystate,
  nationStatuses: [],
  noOrders: false,
  ordersConfirmed: false,
  userIsMember: true,
  toggleAcceptDraw: () => {},
  toggleConfirmOrders: () => {},
  phaseStateIsLoading: false,
};

const nationStatuses: { [key: string]: NationStatus } = {
  France: {
    confirmedOrders: false,
    noOrdersGiven: false,
    numBuilds: null,
    numDisbands: null,
    numSupplyCenters: 3,
    numSupplyCentersToWin: 18,
    wantsDraw: false,
    nation: Nations.France,
    orders: [
      {
        label: "Trieste move to Albania",
        inconsistencies: [],
        resolution: null,
      },
    ],
    homelessInconsistencies: [],
  },
};

export const Default = Template.bind({});
Default.decorators = [
  ordersDecorator({
    ...defaultUseOrdersArgs,
    nationStatuses: [nationStatuses.France],
  }),
];

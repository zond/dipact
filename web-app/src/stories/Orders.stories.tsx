import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { createMemoryHistory } from "history";

import Component from "../pages/Orders";
import { Router } from "react-router";
import { IUseOrders } from "../hooks/useOrders";
import { ordersDecorator } from "./decorators";
import * as PhaseSelectorStories from "./PhaseSelector.stories";
import * as NationSummaryStories from "./NationSummary.stories";
import * as OrderStories from "./Order.stories";
import PhaseSelector from "../components/PhaseSelector";
import NationSummary from "../components/Orders/NationSummary";
import Order from "../components/Orders/Order";

export default {
  title: "pages/Orders",
  component: Component,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  const history = createMemoryHistory();
  return (
    <Router history={history}>
      <div style={{ height: "100%" }}>
        <Component />
      </div>
    </Router>
  );
};

const phaseSelectorStoriesDefaultArgs = PhaseSelectorStories.Default
  .args as Parameters<typeof PhaseSelector>[0];
const nationSummaryStoriesIsUserArgs = NationSummaryStories.IsUser
  .args as Parameters<typeof NationSummary>[0];
const OrderStoriesDefaultArgs = OrderStories.Default.args as Parameters<
  typeof Order
>[0];

const defaultStubbedValues: IUseOrders = {
  isError: false,
  isLoading: false,
  error: null,
  nationStatuses: [],
  noOrders: false,
  ordersConfirmed: false,
  userIsMember: false,
  toggleAcceptDraw: () => {
    return;
  },
  toggleConfirmOrders: () => {
    return;
  },
  phasesDisplay: [...phaseSelectorStoriesDefaultArgs.phases],
  selectedPhase: 1,
  setSelectedPhase: () => {
    return;
  },
  phaseStateIsLoading: false,
};

export const Default = Template.bind({});
Default.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
  }),
];

export const Loading = Template.bind({});
Loading.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    isLoading: true,
  }),
];

export const Error = Template.bind({});
Error.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    isError: true,
    error: {
      status: 500,
      data: "Internal server error",
    },
  }),
];

export const IsUserNoOrders = Template.bind({});
IsUserNoOrders.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    userIsMember: true,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        orders: [],
        homelessInconsistencies: [],
      },
    ],
  }),
];

export const IsUserWithOrder = Template.bind({});
IsUserWithOrder.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    userIsMember: true,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        orders: [OrderStoriesDefaultArgs.order],
        homelessInconsistencies: [],
      },
    ],
  }),
];

export const IsUserWithMultipleOrders = Template.bind({});
IsUserWithMultipleOrders.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    userIsMember: true,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        orders: [
          OrderStoriesDefaultArgs.order,
          {
            ...OrderStoriesDefaultArgs.order,
            label: "London move to English Channel",
          },
        ],
        homelessInconsistencies: [],
      },
    ],
  }),
];

export const IsNotUser = Template.bind({});
IsNotUser.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        nation: {
          ...nationSummaryStoriesIsUserArgs.nation,
          isUser: false,
        },
        orders: [
          OrderStoriesDefaultArgs.order,
          {
            ...OrderStoriesDefaultArgs.order,
            label: "London move to English Channel",
          },
        ],
        homelessInconsistencies: [],
      },
    ],
  }),
];

export const OrdersConfirmed = Template.bind({});
OrdersConfirmed.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    userIsMember: true,
    ordersConfirmed: true,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        nation: {
          ...nationSummaryStoriesIsUserArgs.nation,
        },
        orders: [OrderStoriesDefaultArgs.order],
        homelessInconsistencies: [],
      },
    ],
  }),
];

export const NoOrders = Template.bind({});
NoOrders.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    userIsMember: true,
    noOrders: true,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        nation: {
          ...nationSummaryStoriesIsUserArgs.nation,
        },
        orders: [],
        homelessInconsistencies: [],
      },
    ],
  }),
];

export const WantsDraw = Template.bind({});
WantsDraw.decorators = [
  ordersDecorator({
    ...defaultStubbedValues,
    userIsMember: true,
    nationStatuses: [
      {
        ...nationSummaryStoriesIsUserArgs,
        wantsDraw: true,
        nation: {
          ...nationSummaryStoriesIsUserArgs.nation,
        },
        orders: [],
        homelessInconsistencies: [],
      },
    ],
  }),
];
